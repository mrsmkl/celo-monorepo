import { ContractKit } from '@celo/contractkit';
import { IdentityMetadataWrapper } from '@celo/contractkit/lib/identity';
import { Claim } from '@celo/contractkit/lib/identity/claims/claim';
import { BaseCommand } from '../base';
export declare abstract class ClaimCommand extends BaseCommand {
    static flags: {
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
    requireSynced: boolean;
    protected self: typeof ClaimCommand;
    protected checkMetadataAddress(address: string, from: string): Promise<void>;
    protected readMetadata: () => Promise<IdentityMetadataWrapper>;
    protected get signer(): import("@celo/utils/lib/signatureUtils").Signer;
    protected addClaim(metadata: IdentityMetadataWrapper, claim: Claim): Promise<Claim>;
    protected writeMetadata: (metadata: IdentityMetadataWrapper) => void;
}
export declare const claimFlags: {
    from: import("@oclif/command/lib/flags").IOptionFlag<string>;
};
export declare const claimArgs: import("@oclif/parser/lib/args").IArg<string>[];
export declare const displayMetadata: (metadata: IdentityMetadataWrapper, kit: ContractKit) => Promise<void>;
export declare const modifyMetadata: (kit: ContractKit, filePath: string, operation: (metadata: IdentityMetadataWrapper) => Promise<void>) => Promise<void>;
