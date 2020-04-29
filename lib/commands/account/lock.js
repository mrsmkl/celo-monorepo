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
const command_1 = require("../../utils/command");
class Lock extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.requireSynced = false;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Lock);
            if (res.flags.useLedger) {
                console.warn('Warning: account:lock not implemented for Ledger');
            }
            yield this.web3.eth.personal.lockAccount(res.args.account);
        });
    }
}
exports.default = Lock;
Lock.description = 'Lock an account which was previously unlocked';
Lock.flags = base_1.BaseCommand.flagsWithoutLocalAddresses();
Lock.args = [command_1.Args.address('account', { description: 'Account address' })];
Lock.examples = ['lock 0x5409ed021d9299bf6814279a6a1411a7e866a631'];
//# sourceMappingURL=lock.js.map