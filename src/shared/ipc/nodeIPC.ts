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
    // importIdentity(opts: ImportIdentityOpts): Promise<IpcResponse> {
    //     return ipcRenderer.invoke(MainIpcListenChannels.ImportIdentity, opts)
    // }
    // importIdentityChooseFile(): Promise<string> {
    //     return ipcRenderer
    //         .invoke(MainIpcListenChannels.ImportIdentityChooseFile)
    //         .then((result: IpcResponse) => result.result as string)
    // }
    // exportIdentity(opts: ExportIdentityOpts): Promise<IpcResponse> {
    //     return ipcRenderer.invoke(MainIpcListenChannels.ExportIdentity, opts)
    // }
}

export interface ImportIdentityOpts {
    filename: string
    passphrase: string
}

export interface ExportIdentityOpts {
    id: string
    passphrase: string
}

export const nodeIPC = new MysteriumNodeIPC()