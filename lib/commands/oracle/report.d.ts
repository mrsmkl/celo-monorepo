import { CeloContract } from '@celo/contractkit';
import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class ReportPrice extends BaseCommand {
    static description: string;
    static args: {
        name: string;
        required: boolean;
        default: CeloContract;
        description: string;
        options: CeloContract[];
    }[];
    static flags: {
        from: flags.IOptionFlag<string>;
        value: flags.IOptionFlag<string>;
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
    static example: string[];
    run(): Promise<void>;
}
