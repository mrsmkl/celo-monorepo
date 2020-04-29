import { flags as oFlags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class TestAttestationService extends BaseCommand {
    static description: string;
    static flags: {
        from: oFlags.IOptionFlag<string>;
        phoneNumber: oFlags.IOptionFlag<string>;
        message: oFlags.IOptionFlag<string>;
        privateKey: oFlags.IOptionFlag<string | undefined>;
        node: oFlags.IOptionFlag<string | undefined>;
        useLedger: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        ledgerAddresses: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        ledgerCustomAddresses: oFlags.IOptionFlag<string | undefined>;
        useAKV: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        azureVaultName: oFlags.IOptionFlag<string | undefined>;
        ledgerConfirmAddress: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        logLevel: oFlags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static examples: string[];
    requireSynced: boolean;
    run(): Promise<void>;
}
