import { BaseCommand } from '../../base';
export default class IsValidator extends BaseCommand {
    static description: string;
    static flags: {
        logLevel: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: import("@oclif/parser/lib/args").IArg<string>[];
    static examples: string[];
    run(): Promise<void>;
}
