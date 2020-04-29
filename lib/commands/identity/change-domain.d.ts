import { flags } from '@oclif/command';
import { IArg } from '@oclif/parser/lib/args';
import { BaseCommand } from '../../base';
export default class ChangeDomain extends BaseCommand {
    static description: string;
    static flags: {
        domain: flags.IOptionFlag<string>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: IArg[];
    static examples: string[];
    run(): Promise<void>;
}
