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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
const lockedgold_1 = require("../../utils/lockedgold");
class Lock extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Lock);
            const address = res.flags.from;
            this.kit.defaultAccount = address;
            const value = new bignumber_js_1.default(res.flags.value);
            yield checks_1.newCheckBuilder(this)
                .addCheck(`Value [${value.toFixed()}] is > 0`, () => value.gt(0))
                .isAccount(address)
                .runChecks();
            const lockedGold = yield this.kit.contracts.getLockedGold();
            const pendingWithdrawalsValue = yield lockedGold.getPendingWithdrawalsTotalValue(address);
            const relockValue = bignumber_js_1.default.minimum(pendingWithdrawalsValue, value);
            const lockValue = value.minus(relockValue);
            yield checks_1.newCheckBuilder(this)
                .hasEnoughGold(address, lockValue)
                .runChecks();
            const txos = yield lockedGold.relock(address, relockValue);
            for (const txo of txos) {
                yield cli_1.displaySendTx('relock', txo, { from: address });
            }
            if (lockValue.gt(new bignumber_js_1.default(0))) {
                const tx = lockedGold.lock();
                yield cli_1.displaySendTx('lock', tx, { value: lockValue.toFixed() });
            }
        });
    }
}
exports.default = Lock;
Lock.description = 'Locks Celo Gold to be used in governance and validator elections.';
Lock.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.flags.string(Object.assign(Object.assign({}, command_2.Flags.address), { required: true })), value: command_1.flags.string(Object.assign(Object.assign({}, lockedgold_1.LockedGoldArgs.valueArg), { required: true })) });
Lock.args = [];
Lock.examples = [
    'lock --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --value 10000000000000000000000',
];
//# sourceMappingURL=lock.js.map