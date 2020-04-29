import { IArg } from '@oclif/parser/lib/args';
import { BaseCommand } from '../../base';
export default class ChangeAttestationServiceUrl extends BaseCommand {
    static description: string;
    static flags: {
        url: import("@oclif/command/lib/flags").IOptionFlag<string>;
        logLevel: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: IArg[];
    static examples: string[];
    run(): Promise<void>;
}
