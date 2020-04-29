import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class Commitment extends BaseCommand {
    static description: string;
    static flags: {
        from: flags.IOptionFlag<string>;
        noticePeriod: flags.IOptionFlag<string>;
        goldAmount: flags.IOptionFlag<string>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: never[];
    static examples: string[];
    run(): Promise<void>;
}
