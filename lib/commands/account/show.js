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
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
class Show extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args } = this.parse(Show);
            const accounts = yield this.kit.contracts.getAccounts();
            const address = yield accounts.signerToAccount(args.address);
            cli_1.printValueMapRecursive(yield accounts.getAccountSummary(address));
        });
    }
}
exports.default = Show;
Show.description = 'Show information for an account, including name, authorized vote, validator, and attestation signers, the URL at which account metadata is hosted, the address the account is using with the mobile wallet, and a public key that can be used to encrypt information for the account.';
Show.flags = Object.assign({}, base_1.BaseCommand.flags);
Show.args = [command_1.Args.address('address')];
Show.examples = ['show 0x5409ed021d9299bf6814279a6a1411a7e866a631'];
//# sourceMappingURL=show.js.map