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
class Unlock extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Unlock);
            this.kit.defaultAccount = res.flags.from;
            const lockedgold = yield this.kit.contracts.getLockedGold();
            const value = new bignumber_js_1.default(res.flags.value);
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isAccount(res.flags.from)
                .isNotVoting(res.flags.from)
                .hasEnoughLockedGoldToUnlock(value)
                .runChecks();
            yield cli_1.displaySendTx('unlock', lockedgold.unlock(value));
        });
    }
}
exports.default = Unlock;
Unlock.description = 'Unlocks Celo Gold, which can be withdrawn after the unlocking period. Unlocked gold will appear as a "pending withdrawal" until the unlocking period is over, after which it can be withdrawn via "lockedgold:withdraw".';
Unlock.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true }), value: command_1.flags.string(Object.assign(Object.assign({}, lockedgold_1.LockedGoldArgs.valueArg), { required: true })) });
Unlock.args = [];
Unlock.examples = ['unlock --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --value 500000000'];
//# sourceMappingURL=unlock.js.map