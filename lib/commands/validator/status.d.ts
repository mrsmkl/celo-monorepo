import { Address } from '@celo/contractkit';
import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
interface ValidatorStatusEntry {
    name: string;
    address: Address;
    signer: Address;
    elected: boolean;
    frontRunner: boolean;
    signatures: number;
    proposed: number;
}
export declare const statusTable: {
    address: {};
    name: {};
    signer: {};
    elected: {};
    frontRunner: {};
    proposed: {
        get: (v: ValidatorStatusEntry) => number | "";
    };
    signatures: {
        get: (v: ValidatorStatusEntry) => string;
    };
};
export default class ValidatorStatus extends BaseCommand {
    static description: string;
    static flags: {
        validator: flags.IOptionFlag<string | undefined>;
        signer: flags.IOptionFlag<string | undefined>;
        all: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        lookback: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        privateKey: flags.IOptionFlag<string | undefined>;
        useLedger: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        ledgerAddresses: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        ledgerCustomAddresses: flags.IOptionFlag<string | undefined>;
        ledgerConfirmAddress: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        node: flags.IOptionFlag<string | undefined>;
        useAKV: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        azureVaultName: flags.IOptionFlag<string | undefined>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static examples: string[];
    run(): Promise<void>;
    private getStatus;
}
export {};
