import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class Analyze extends BaseCommand {
    static description: string;
    static flags: {
        start: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        end: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        privateKey: flags.IOptionFlag<string | undefined>;
        node: flags.IOptionFlag<string | undefined>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: import("@oclif/parser/lib/args").IArg<string>[];
    static examples: string[];
    run(): Promise<void>;
}
