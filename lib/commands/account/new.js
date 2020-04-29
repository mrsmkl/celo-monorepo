"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("@celo/utils/lib/account");
const address_1 = require("@celo/utils/lib/address");
const command_1 = require("@oclif/command");
const ethereumjs_util_1 = require("ethereumjs-util");
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
class NewAccount extends base_1.LocalCommand {
    static languageOptions(language) {
        if (language) {
            // @ts-ignore
            const enumLanguage = account_1.MnemonicLanguages[language];
            return enumLanguage;
        }
        return undefined;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(NewAccount);
            const mnemonic = yield account_1.generateMnemonic(account_1.MnemonicStrength.s256_24words, NewAccount.languageOptions(res.flags.language));
            const keys = yield account_1.generateKeys(mnemonic, res.flags.password, res.flags.indexAddress);
            const accountAddress = ethereumjs_util_1.toChecksumAddress(address_1.privateKeyToAddress(keys.privateKey));
            this.log('This is not being stored anywhere. Save the mnemonic somewhere to use this account at a later point.\n');
            cli_1.printValueMap(Object.assign({ mnemonic, accountAddress }, keys));
        });
    }
}
exports.default = NewAccount;
NewAccount.description = "Creates a new account locally using the Celo Derivation Path (m/44'/52752'/0/0/indexAddress) and print out the key information. Save this information for local transaction signing or import into a Celo node. Ledger: this command has been tested swapping mnemonics with the Ledger successfully (only supports english)";
NewAccount.flags = Object.assign(Object.assign({}, base_1.LocalCommand.flags), { password: command_1.flags.string({
        description: 'Choose a password to generate the keys',
    }), indexAddress: command_1.flags.integer({
        default: 0,
        description: 'Choose the index address of the derivation path',
    }), language: command_1.flags.string({
        options: [
            'chinese_simplified',
            'chinese_traditional',
            'english',
            'french',
            'italian',
            'japanese',
            'korean',
            'spanish',
        ],
        default: 'english',
        description: "Language for the mnemonic words. **WARNING**, some hardware wallets don't support other languages",
    }) });
NewAccount.examples = [
    'new',
    'new --password 12341234',
    'new --language spanish',
    'new --password 12341234 --language japanese --indexAddress 5',
];
//# sourceMappingURL=new.js.map