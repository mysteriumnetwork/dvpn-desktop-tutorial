import * as os from "os"
import { execFileSync } from "child_process"
import { exec } from "sudo-prompt"
import * as semver from "semver"
import * as path from "path"
import * as isDev from "electron-is-dev";
import { ChildProcess, spawn, SpawnOptions } from "child_process"

import * as packageJson from "../../package.json"
import { log } from "./log"

export const spawnProcess = (
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnOptions = {},
): ChildProcess => {
    log.info("Spawning a child process: ", command, ...args.map((a) => (a.indexOf(" ") != -1 ? `'${a}'` : a)))
    return spawn(command, args, options)
}

export const staticAssetPath = (assetPath: string): string => {
    // __static exist only when using webpack
    return path.join(__static, assetPath)
}

export const sudoExec = (cmd: string): void => {
    if (os.platform() === "darwin" && semver.gte(os.release(), "19.0.0")) {
        // >= macOS Catalina
        catalinaSudoExec(cmd)
        return
    }
    exec(
        cmd,
        {
            name: packageJson.productName,
            icns: staticAssetPath("logo.icns"),
        },
        (error?: Error, stdout?: string | Buffer, stderr?: string | Buffer) => {
            log.info("[sudo-exec]", stdout, stderr)
            if (error) {
                log.error("[sudo-exec] error:", error)
            }
        },
    )
}

const catalinaSudoExec = (cmd: string) => {
    execFileSync("sudo", ["--askpass", "sh", "-c", cmd], {
        encoding: "utf8",
        env: {
            PATH: process.env.PATH,
            SUDO_ASKPASS: staticAssetPath("sudo-askpass.osascript.js"),
            NODE_ENV: isDev?"development":"production"
        },
    })
}

export const uid = (): string => {
    let uid = 0
    // getuid only available on POSIX
    // and it's not needed on windows anyway
    if (os.platform() !== "win32") {
        uid = process.getuid()
    }
    return uid.toString()
}