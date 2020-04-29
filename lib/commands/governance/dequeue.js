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
class Dequeue extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Dequeue);
            const account = res.flags.from;
            this.kit.defaultAccount = account;
            const governance = yield this.kit.contracts.getGovernance();
            yield governance.dequeueProposalsIfReady().sendAndWaitForReceipt();
        });
    }
}
exports.default = Dequeue;
Dequeue.description = 'Try to dequeue governance proposal';
Dequeue.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({ required: true, description: 'From address' }) });
Dequeue.examples = ['dequeue --from 0x5409ed021d9299bf6814279a6a1411a7e866a631'];
//# sourceMappingURL=dequeue.js.map