import { BaseCommand } from '../base';
export default class ValidatorSet extends BaseCommand {
    static description: string;
    static flags: {
        logLevel: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static examples: string[];
    run(): Promise<void>;
}
