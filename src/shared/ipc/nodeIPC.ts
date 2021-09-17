import { ipcRenderer } from "electron"

import { MainIpcListenChannels } from "./ipcChannels"

export class MysteriumNodeIPC {
    start(): Promise<void> {
        return ipcRenderer.invoke(MainIpcListenChannels.StartNode)
    }
    stop(): Promise<void> {
        return ipcRenderer.invoke(MainIpcListenChannels.StopNode)
    }
    killGhosts(): Promise<void> {
        return ipcRenderer.invoke(MainIpcListenChannels.KillGhosts)
    }
}

export const nodeIPC = new MysteriumNodeIPC()