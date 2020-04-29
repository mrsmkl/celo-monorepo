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
class Register extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Register);
            this.kit.defaultAccount = res.flags.from;
            const accounts = yield this.kit.contracts.getAccounts();
            yield checks_1.newCheckBuilder(this)
                .isNotAccount(res.flags.from)
                .runChecks();
            yield cli_1.displaySendTx('register', accounts.createAccount());
            if (res.flags.name) {
                yield cli_1.displaySendTx('setName', accounts.setName(res.flags.name));
            }
        });
    }
}
exports.default = Register;
Register.description = 'Register an account on-chain. This allows you to lock Gold, which is a pre-requisite for registering a Validator or Group, participating in Validator elections and on-chain Governance, and earning epoch rewards.';
Register.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { name: command_1.flags.string(), from: command_2.Flags.address({ required: true }) });
Register.args = [];
Register.examples = [
    'register --from 0x5409ed021d9299bf6814279a6a1411a7e866a631',
    'register --from 0x5409ed021d9299bf6814279a6a1411a7e866a631 --name test-account',
];
//# sourceMappingURL=register.js.map