import { KeybaseClaim } from '@celo/contractkit/lib/identity/claims/claim';
import { flags } from '@oclif/command';
import { ClaimCommand } from '../../utils/identity';
export default class ClaimKeybase extends ClaimCommand {
    static description: string;
    static flags: {
        username: flags.IOptionFlag<string>;
        from: flags.IOptionFlag<string>;
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
    static args: import("@oclif/parser/lib/args").IArg<string>[];
    static examples: string[];
    self: typeof ClaimKeybase;
    run(): Promise<void>;
    attemptAutomaticProofUpload(claim: KeybaseClaim, signature: string, username: string, address: string): Promise<void>;
    uploadProof(claim: KeybaseClaim, signature: string, username: string, address: string): Promise<void>;
    printManualInstruction(claim: KeybaseClaim, signature: string, username: string, address: string): void;
    ensureKeybaseFilePathToProof(base: string): Promise<void>;
}
