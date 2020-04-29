import { Validator } from '@celo/contractkit/lib/wrappers/Validators';
import { BaseCommand } from '../../base';
export default class AttestationServicesCurrent extends BaseCommand {
    static description: string;
    static flags: {
        privateKey: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        useLedger: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        ledgerAddresses: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        ledgerCustomAddresses: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        ledgerConfirmAddress: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        node: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        useAKV: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        azureVaultName: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        logLevel: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    getStatus(validator: Validator): Promise<{
        hasAttestationSigner: boolean;
        attestationServiceURL: string;
        okStatus: boolean;
        error: string;
        smsProviders: never[];
        blacklistedRegionCodes: never[];
        rightAccount: boolean;
        name: string;
        address: string;
        ecdsaPublicKey: string;
        blsPublicKey: string;
        affiliation: string | null;
        score: import("bignumber.js").default;
        signer: string;
    }>;
    run(): Promise<void>;
}
