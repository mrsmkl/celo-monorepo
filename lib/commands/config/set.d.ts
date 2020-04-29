import { flags } from '@oclif/command';
import { LocalCommand } from '../../base';
export default class Set extends LocalCommand {
    static description: string;
    static flags: {
        node: flags.IOptionFlag<string>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static examples: string[];
    run(): Promise<void>;
}
