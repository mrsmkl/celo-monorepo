import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export declare const table: {
    index: {};
    votes: {};
    score: {};
    name: {};
    address: {};
    groupName: {};
    affiliation: {};
};
export default class ElectionCompare extends BaseCommand {
    static description: string;
    static flags: {
        'at-block': import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
        privateKey: flags.IOptionFlag<string | undefined>;
        node: flags.IOptionFlag<string | undefined>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
