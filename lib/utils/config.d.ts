export interface CeloConfig {
    nodeUrl: string;
}
export declare const localGeth: CeloConfig;
export declare function configPath(configDir: string): string;
export declare function readConfig(configDir: string): CeloConfig;
export declare function getNodeUrl(configDir: string): string;
export declare function writeConfig(configDir: string, configObj: CeloConfig): void;
