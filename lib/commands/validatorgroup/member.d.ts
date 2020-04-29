import { flags } from '@oclif/command';
import { IArg } from '@oclif/parser/lib/args';
import { BaseCommand } from '../../base';
export default class ValidatorGroupMembers extends BaseCommand {
    static description: string;
    static flags: {
        from: flags.IOptionFlag<string>;
        accept: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        remove: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        reorder: import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
        privateKey: flags.IOptionFlag<string | undefined>;
        node: flags.IOptionFlag<string | undefined>;
        useLedger: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        ledgerAddresses: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        ledgerCustomAddresses: flags.IOptionFlag<string | undefined>;
        useAKV: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        azureVaultName: flags.IOptionFlag<string | undefined>;
        ledgerConfirmAddress: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: IArg[];
    static examples: string[];
    run(): Promise<void>;
}
