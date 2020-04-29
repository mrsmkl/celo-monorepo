import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class Rewards extends BaseCommand {
    static description: string;
    static flags: {
        from: flags.IOptionFlag<string>;
        redeem: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        delegate: flags.IOptionFlag<string | undefined>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: never[];
    static examples: string[];
    run(): Promise<void>;
}
