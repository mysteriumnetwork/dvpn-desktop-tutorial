import electronLog from "electron-log"

electronLog.transports.console.level = "silly"
electronLog.transports.file.resolvePath = () => './main.log';
electronLog.transports.file.level = "silly"

export const log = electronLog