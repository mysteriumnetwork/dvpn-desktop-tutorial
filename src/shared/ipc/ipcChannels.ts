export enum WebIpcListenChannels {
    Disconnect = "disconnect",
}

export enum MainIpcListenChannels {
    GetOS = "get-os",
    GetMachineId = "get-machine-id",
    Update = "update",
    ConnectionStatus = "connection-status",
    SupervisorConnect = "supervisor-connect",
    SupervisorInstall = "supervisor-install",
    SupervisorUpgrade = "supervisor-upgrade",
    SupervisorDisconnect = "supervisor-disconnect",
    KillGhosts = "kill-ghost",
    StartNode = "start-node",
    StopNode = "stop-node",
}

export interface IpcResponse {
    result?: unknown
    error?: string
}