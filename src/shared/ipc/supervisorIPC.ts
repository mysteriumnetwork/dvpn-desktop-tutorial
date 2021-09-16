import { ipcRenderer } from "electron"

import { MainIpcListenChannels } from "./ipcChannels"

export class SupervisorIPC {
    async connect(): Promise<void> {
        return await ipcRenderer.invoke(MainIpcListenChannels.SupervisorConnect)
    }
    async install(): Promise<void> {
        return await ipcRenderer.invoke(MainIpcListenChannels.SupervisorInstall)
    }
    async upgrade(): Promise<void> {
        return await ipcRenderer.invoke(MainIpcListenChannels.SupervisorUpgrade)
    }
    async disconnect(): Promise<void> {
        return await ipcRenderer.invoke(MainIpcListenChannels.SupervisorDisconnect)
    }
}

export const supervisorIPC = new SupervisorIPC()