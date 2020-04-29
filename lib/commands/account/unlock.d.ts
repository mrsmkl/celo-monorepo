import { flags } from '@oclif/command';
import { IArg } from '@oclif/parser/lib/args';
import { BaseCommand } from '../../base';
export default class Unlock extends BaseCommand {
    static description: string;
    static flags: {
        password: flags.IOptionFlag<string | undefined>;
        duration: import("@oclif/parser/lib/flags").IOptionFlag<number>;
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
    static args: IArg[];
    static examples: string[];
    requireSynced: boolean;
    run(): Promise<void>;
}
