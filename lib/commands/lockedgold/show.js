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
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
class Show extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args } = this.parse(Show);
            const lockedGold = yield this.kit.contracts.getLockedGold();
            yield checks_1.newCheckBuilder(this)
                .isAccount(args.account)
                .runChecks();
            cli_1.printValueMapRecursive(yield lockedGold.getAccountSummary(args.account));
        });
    }
}
exports.default = Show;
Show.description = 'Show Locked Gold information for a given account. This includes the total amount of locked gold, the amount being used for voting in Validator Elections, the Locked Gold balance this account is required to maintain due to a registered Validator or Validator Group, and any pending withdrawals that have been initiated via "lockedgold:unlock".';
Show.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
Show.args = [command_1.Args.address('account')];
Show.examples = ['show 0x5409ed021d9299bf6814279a6a1411a7e866a631'];
//# sourceMappingURL=show.js.map