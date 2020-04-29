import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class ValidatorAffiliate extends BaseCommand {
    static description: string;
    static flags: {
        from: flags.IOptionFlag<string>;
        unset: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        set: flags.IOptionFlag<string | undefined>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static examples: string[];
    run(): Promise<void>;
}
