import { BaseCommand } from '../../base';
export default class ValidatorPublicKey extends BaseCommand {
    static description: string;
    static flags: {
        from: import("@oclif/command/lib/flags").IOptionFlag<string>;
        publicKey: import("@oclif/command/lib/flags").IOptionFlag<string>;
        logLevel: import("@oclif/command/lib/flags").IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static examples: string[];
    run(): Promise<void>;
}
