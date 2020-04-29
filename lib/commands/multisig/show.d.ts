import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class ShowMultiSig extends BaseCommand {
    static description: string;
    static flags: {
        tx: import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
        all: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        raw: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
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
    static args: import("@oclif/parser/lib/args").IArg<string>[];
    static examples: string[];
    run(): Promise<void>;
}
