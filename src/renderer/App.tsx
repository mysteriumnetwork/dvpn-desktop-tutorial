import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./App.css";
import Header from "./components/Header";
import Identity, { IdentityResponse } from "./components/Identity";
import Connection from "./components/Connection";
import { supervisorIPC } from "../shared/ipc/supervisorIPC";
import { nodeIPC } from "../shared/ipc/nodeIPC";
import {
  TequilapiClientFactory,
  ConnectionInfo,
  IdentityRef,
} from "mysterium-vpn-js";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

let tequilapi = new TequilapiClientFactory(
  `http://127.0.0.1:44050`,
  100000
).build();

var currentIdentity:string;
var connectionInfo:ConnectionInfo|undefined;
var identities:IdentityRef[];


async function getIdentity(
  id: string,
  password: string,
  create?: boolean
): Promise<any> {
  let consumerId = "";
  if (create) {
    let res = await tequilapi.identityCreate(password);
    await tequilapi.identityRegister(res.id);
    consumerId = res.id;
  } else {
    consumerId = id;
  }
  await tequilapi.identityUnlock(consumerId, password);
  console.log("Got consumer");
  currentIdentity=consumerId
}

async function Startup() {
  await nodeIPC.start();
  await supervisorIPC.install();
  await supervisorIPC.connect();
  console.log("Inited");
}

async function Register(res: IdentityResponse) {
  await getIdentity(res.id, res.password, res.create);
}

async function Disconnect(): Promise<any> {
  let status = await tequilapi.connectionStatus();
  if (status.status == "Connected") {
    await tequilapi.connectionCancel();
  }
}

async function ConnectRandom(consumerId: string): Promise<any> {
  let status = await tequilapi.connectionStatus();
  if (status.status == "Connected") {
    await tequilapi.connectionCancel();
  }
  console.log(status);
  let proposal = {
    natCompatibility: "auto",
  };
  let proposals = await tequilapi.findProposals(proposal);
  let num = Math.round(Math.random() * proposals.length);
  let prop = proposals[num];
  let request = {
    consumerId: consumerId,
    providerId: prop.providerId,
    serviceType: prop.serviceType,
  };
  console.log("try connect");
  let res = await tequilapi.connectionCreate(request);
  if (res.status == "Connected") {
    connectionInfo = res
  }
}


function App() {
  // АПДЕЙТЯ СТЕЙТ ДЕЛАЕШЬ РЕЛОАД И ВСЕ СБРАСЫВАЕТСЯ

  const [step, setStep] = useState("");

  useEffect(() => {
    async function run() {
      await Startup();
      identities = await tequilapi.identityList();
      let status = await tequilapi.connectionStatus();
      if (status.status == "Connected") {
        connectionInfo = status;
        currentIdentity = status.consumerId||"";
        setStep("connectionInfo")
      } else {
        setStep("select")
      }
    }
    run();
  }, []);

  console.log("Reload!!!");
  console.log(step, currentIdentity, connectionInfo);
  return (
    <div className="app">
      <Header />
      <div className="dashboard">
        {!currentIdentity && !identities?.length && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        )}
        {!currentIdentity && identities?.length > 0 && (
          <Identity identities={identities} onSubmit={async (res:IdentityResponse)=>{await Register(res); setStep("connectionMake");}} />
        )}
        {currentIdentity && (
          <Connection
            connect={async () => {
              await ConnectRandom(currentIdentity);
              setStep("connectionInfo")
            }}
            disconnect={async () => {await Disconnect(); connectionInfo=undefined; setStep("select")}}
            connection={connectionInfo}
          />
        )}
      </div>
    </div>
  );
}

export default App;
