import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class ValidatorGroupVote extends BaseCommand {
    static description: string;
    static flags: {
        from: flags.IOptionFlag<string>;
        current: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        revoke: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        for: flags.IOptionFlag<string | undefined>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static examples: string[];
    run(): Promise<void>;
}
