import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export default class Voters extends BaseCommand {
    static description: string;
    static flags: {
        'from-block': import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
        'to-block': import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
        'at-block': import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
        group: flags.IOptionFlag<string | undefined>;
        debug: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        privateKey: flags.IOptionFlag<string | undefined>;
        node: flags.IOptionFlag<string | undefined>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
