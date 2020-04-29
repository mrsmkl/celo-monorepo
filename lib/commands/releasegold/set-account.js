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
const command_1 = require("@oclif/command");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const release_gold_1 = require("./release-gold");
class SetAccount extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(SetAccount);
            const isRevoked = yield this.releaseGoldWrapper.isRevoked();
            yield checks_1.newCheckBuilder(this)
                .isAccount(this.releaseGoldWrapper.address)
                .addCheck('Contract is not revoked', () => !isRevoked)
                .runChecks();
            let tx;
            if (flags.property === 'name') {
                tx = this.releaseGoldWrapper.setAccountName(flags.value);
            }
            else if (flags.property === 'dataEncryptionKey') {
                tx = this.releaseGoldWrapper.setAccountDataEncryptionKey(flags.value);
            }
            else if (flags.property === 'metaURL') {
                tx = this.releaseGoldWrapper.setAccountMetadataURL(flags.value);
            }
            else {
                return this.error(`Invalid property provided`);
            }
            this.kit.defaultAccount = yield this.releaseGoldWrapper.getBeneficiary();
            yield cli_1.displaySendTx('setAccount' + flags.property + 'Tx', tx);
        });
    }
}
exports.default = SetAccount;
SetAccount.description = 'Set account properties of the ReleaseGold instance account such as name, data encryption key, and the metadata URL';
SetAccount.flags = Object.assign(Object.assign({}, release_gold_1.ReleaseGoldCommand.flags), { property: command_1.flags.string({
        char: 'p',
        options: ['name', 'dataEncryptionKey', 'metaURL'],
        description: 'Property type to set',
        required: true,
    }), value: command_1.flags.string({
        char: 'v',
        description: 'Property value to set',
        required: true,
    }) });
SetAccount.args = [];
SetAccount.examples = [
    'set-account --contract 0x5719118266779B58D0f9519383A4A27aA7b829E5 --property name --value mywallet',
    'set-account --contract 0x5719118266779B58D0f9519383A4A27aA7b829E5 --property dataEncryptionKey --value 0x041bb96e35f9f4b71ca8de561fff55a249ddf9d13ab582bdd09a09e75da68ae4cd0ab7038030f41b237498b4d76387ae878dc8d98fd6f6db2c15362d1a3bf11216',
    'set-account --contract 0x5719118266779B58D0f9519383A4A27aA7b829E5 --property metaURL --value www.test.com',
];
//# sourceMappingURL=set-account.js.map