import BigNumber from 'bignumber.js';
import { BaseCommand } from '../../base';
export default class ExchangeGold extends BaseCommand {
    static description: string;
    static flags: {
        from: import("@oclif/command/lib/flags").IOptionFlag<string>;
        value: import("@oclif/command/lib/flags").IOptionFlag<BigNumber>;
        forAtLeast: import("@oclif/command/lib/flags").IOptionFlag<BigNumber | undefined>;
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
    static args: never[];
    static examples: string[];
    run(): Promise<void>;
}
