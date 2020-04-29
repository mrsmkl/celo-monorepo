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
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class SetName extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(SetName);
            this.kit.defaultAccount = res.flags.account;
            const accounts = yield this.kit.contracts.getAccounts();
            yield checks_1.newCheckBuilder(this)
                .isAccount(res.flags.account)
                .runChecks();
            yield cli_1.displaySendTx('setName', accounts.setName(res.flags.name));
        });
    }
}
exports.default = SetName;
SetName.description = "Sets the name of a registered account on-chain. An account's name is an optional human readable identifier";
SetName.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { account: command_2.Flags.address({ required: true }), name: command_1.flags.string({ required: true }) });
SetName.args = [];
SetName.examples = [
    'set-name --account 0x5409ed021d9299bf6814279a6a1411a7e866a631 --name test-account',
];
//# sourceMappingURL=set-name.js.map