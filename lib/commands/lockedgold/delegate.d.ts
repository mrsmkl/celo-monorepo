import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class Delegate extends BaseCommand {
    static description: string;
    static flags: {
        from: flags.IOptionFlag<string>;
        role: flags.IOptionFlag<string | undefined>;
        to: flags.IOptionFlag<string>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: never[];
    static examples: string[];
    run(): Promise<void>;
}
