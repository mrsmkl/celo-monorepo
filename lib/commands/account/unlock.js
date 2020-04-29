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
const cli_ux_1 = require("cli-ux");
const base_1 = require("../../base");
const command_2 = require("../../utils/command");
class Unlock extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.requireSynced = false;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Unlock);
            if (res.flags.useLedger) {
                console.warn('Warning: account:unlock not implemented for Ledger');
            }
            const password = res.flags.password || (yield cli_ux_1.cli.prompt('Password', { type: 'hide', required: false }));
            yield this.web3.eth.personal.unlockAccount(res.args.account, password, res.flags.duration);
        });
    }
}
exports.default = Unlock;
Unlock.description = 'Unlock an account address to send transactions or validate blocks';
Unlock.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses()), { password: command_1.flags.string({
        required: false,
        description: 'Password used to unlock the account. If not specified, you will be prompted for a password.',
    }), duration: command_1.flags.integer({
        required: false,
        default: 0,
        description: 'Duration in seconds to leave the account unlocked. Unlocks until the node exits by default.',
    }) });
Unlock.args = [command_2.Args.address('account', { description: 'Account address' })];
Unlock.examples = [
    'unlock 0x5409ed021d9299bf6814279a6a1411a7e866a631',
    'unlock 0x5409ed021d9299bf6814279a6a1411a7e866a631 --duration 600',
];
//# sourceMappingURL=unlock.js.map