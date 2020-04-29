import { CeloContract } from '@celo/contractkit';
import { BaseCommand } from '../../base';
export default class GetRates extends BaseCommand {
    static description: string;
    static flags: {
        privateKey: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        node: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        useLedger: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        logLevel: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: {
        name: string;
        required: boolean;
        description: string;
        options: CeloContract[];
        default: CeloContract;
    }[];
    static example: string[];
    run(): Promise<void>;
}
