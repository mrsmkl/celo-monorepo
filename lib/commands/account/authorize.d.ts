import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class Authorize extends BaseCommand {
    static description: string;
    static flags: {
        from: flags.IOptionFlag<string>;
        role: flags.IOptionFlag<string>;
        signature: flags.IOptionFlag<string>;
        signer: flags.IOptionFlag<string>;
        blsKey: flags.IOptionFlag<string | undefined>;
        blsPop: flags.IOptionFlag<string | undefined>;
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
    static args: never[];
    static examples: string[];
    run(): Promise<void>;
}
