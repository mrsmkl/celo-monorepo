import { ReleaseGoldWrapper } from '@celo/contractkit/lib/wrappers/ReleaseGold';
import { BaseCommand } from '../../base';
export declare abstract class ReleaseGoldCommand extends BaseCommand {
    static flags: {
        contract: import("@oclif/command/lib/flags").IOptionFlag<string>;
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
    private _contractAddress;
    private _releaseGoldWrapper;
    get contractAddress(): string;
    get releaseGoldWrapper(): ReleaseGoldWrapper;
    init(): Promise<void>;
}
