import { ClaimCommand } from '../../utils/identity';
export default class ClaimAttestationServiceUrl extends ClaimCommand {
    static description: string;
    static flags: {
        url: import("@oclif/command/lib/flags").IOptionFlag<string>;
        from: import("@oclif/command/lib/flags").IOptionFlag<string>;
        privateKey: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        node: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        useLedger: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        ledgerAddresses: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        ledgerCustomAddresses: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        useAKV: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        azureVaultName: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        ledgerConfirmAddress: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        logLevel: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: import("@oclif/parser/lib/args").IArg<string>[];
    static examples: string[];
    self: typeof ClaimAttestationServiceUrl;
    run(): Promise<void>;
}
