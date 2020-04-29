import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class List extends BaseCommand {
    static description: string;
    static flags: {
        amount: flags.IOptionFlag<string | undefined>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: never[];
    static examples: string[];
    run(): Promise<void>;
}
