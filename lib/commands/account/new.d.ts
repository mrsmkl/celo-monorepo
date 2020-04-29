import { MnemonicLanguages } from '@celo/utils/lib/account';
import { flags } from '@oclif/command';
import { LocalCommand } from '../../base';
export default class NewAccount extends LocalCommand {
    static description: string;
    static flags: {
        password: flags.IOptionFlag<string | undefined>;
        indexAddress: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        language: flags.IOptionFlag<string | undefined>;
        logLevel: flags.IOptionFlag<string | undefined>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        truncate: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static examples: string[];
    static languageOptions(language: string): MnemonicLanguages | undefined;
    run(): Promise<void>;
}
