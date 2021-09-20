import { IdentityResponse } from "../components/Identity";
import { supervisorIPC } from "../../shared/ipc/supervisorIPC";
import { nodeIPC } from "../../shared/ipc/nodeIPC";
import {
  TequilapiClientFactory,
  ConnectionInfo,
  IdentityRef,
} from "mysterium-vpn-js";

import { log } from "../../shared/log";

let tequilapi = new TequilapiClientFactory(
  `http://127.0.0.1:44050`,
  100000 // 100sec timeout. Some requests could take a while
).build();

type StateInterface = {
  currentIdentity: string;
  connectionInfo: ConnectionInfo | undefined;
  identities: IdentityRef[];
  loaded: boolean;
  connectionSucces: CallableFunction;
};

export var State: StateInterface = {
  currentIdentity: "",
  connectionInfo: undefined,
  identities: [],
  loaded: false,
  connectionSucces: () => {},
};

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getIdentity(
  id: string,
  password: string,
  create?: boolean
): Promise<any> {
  let consumerId = "";
  if (create) {
    let res = await tequilapi.identityCreate(password);
    await tequilapi.identityUnlock(res.id, password);
    await tequilapi.identityRegister(res.id);
    consumerId = res.id;
    State.identities.push(res);
  } else {
    consumerId = id;
    await tequilapi.identityUnlock(consumerId, password);
  }

  log.info("Got unclocked consumer identity");
  State.currentIdentity = consumerId;
}

export async function Startup() {
  await nodeIPC.start();
  try {
    await supervisorIPC.connect();
  } catch (err) {
    log.info("Failed to connect to the supervisor, installing", err);
    await supervisorIPC.install();
    await supervisorIPC.connect();
  }
  while (true) {
    try {
      await tequilapi.connectionStatus();
      break
    } catch {
      await sleep(500)
    }
  }
  log.info("Node & Supervisor started");
}

export async function Register(res: IdentityResponse) {
  await getIdentity(res.id, res.password, res.create);
}

export async function Disconnect(): Promise<any> {
  let status = await tequilapi.connectionStatus();
  if (status.status == "Connected") {
    await tequilapi.connectionCancel();
    State.connectionInfo = undefined;
    log.info(`Disconnected from ${status.proposal?.providerId}`);
  }
}

export async function Preload(): Promise<boolean> {
  State.identities = await tequilapi.identityList();
  let status = await tequilapi.connectionStatus();
  State.loaded = true;
  if (status.status == "Connected") {
    State.connectionInfo = status;
    State.currentIdentity = status.consumerId || "";
    return true;
  } else {
    return false;
  }
}

export async function Back(): Promise<any> {
  await Disconnect();
  State.currentIdentity = "";
  State.connectionInfo = undefined;
}

export async function ConnectRandom(consumerId: string): Promise<any> {
  try {
    let status = await tequilapi.connectionStatus();
    if (status.status == "Connected") {
      await tequilapi.connectionCancel();
    }
    let proposal = {
      natCompatibility: "auto",
      serviceType: "wireguard", // openvpn and noop used only for testing
    };
    let proposals = await tequilapi.findProposals(proposal);
    let num = Math.round(Math.random() * proposals.length);
    let prop = proposals[num];
    let request = {
      consumerId: consumerId,
      providerId: prop.providerId,
      serviceType: prop.serviceType,
    };
    let res = await tequilapi.connectionCreate(request);
    if (res.status == "Connected") {
      State.connectionInfo = res;
      State.connectionSucces();
      log.info(`Connected to ${res.proposal?.providerId}`);
    }
  } catch {
    State.connectionSucces();
  }
}
