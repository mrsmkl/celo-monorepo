import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class DollarTransfer extends BaseCommand {
    static description: string;
    static flags: {
        from: flags.IOptionFlag<string>;
        to: flags.IOptionFlag<string>;
        amountInWei: flags.IOptionFlag<string>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static examples: string[];
    run(): Promise<void>;
}
