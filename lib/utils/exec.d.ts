/// <reference types="node" />
import { SpawnOptions } from 'child_process';
export declare function execCmd(cmd: string, args: string[], options?: SpawnOptions & {
    silent?: boolean;
}): Promise<number>;
export declare function execWith0Exit(cmd: string, args: string[], options?: SpawnOptions & {
    silent?: boolean;
}): Promise<boolean>;
export declare function execCmdWithError(cmd: string, args: string[], options?: SpawnOptions & {
    silent?: boolean;
}): Promise<void>;
export declare function commandExists(command: string): Promise<string>;
