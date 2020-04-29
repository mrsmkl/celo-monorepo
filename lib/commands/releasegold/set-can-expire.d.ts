import { flags } from '@oclif/command';
import { ReleaseGoldCommand } from './release-gold';
export default class SetCanExpire extends ReleaseGoldCommand {
    static description: string;
    static expireOptions: string[];
    static flags: {
        value: flags.IOptionFlag<string>;
        yesreally: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        contract: flags.IOptionFlag<string>;
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
