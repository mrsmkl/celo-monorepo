import { IArg } from '@oclif/parser/lib/args';
import { BaseCommand } from '../../base';
export default class GetMetadata extends BaseCommand {
    static description: string;
    static flags: {
        logLevel: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: IArg[];
    static examples: string[];
    run(): Promise<void>;
}
