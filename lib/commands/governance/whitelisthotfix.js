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
const ethereumjs_util_1 = require("ethereumjs-util");
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class WhitelistHotfix extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(WhitelistHotfix);
            const hash = ethereumjs_util_1.toBuffer(res.flags.hash);
            const account = res.flags.from;
            this.kit.defaultAccount = account;
            yield checks_1.newCheckBuilder(this)
                .hotfixNotExecuted(hash)
                .runChecks();
            const governance = yield this.kit.contracts.getGovernance();
            yield cli_1.displaySendTx('whitelistHotfixTx', governance.whitelistHotfix(hash), {}, 'HotfixWhitelisted');
        });
    }
}
exports.default = WhitelistHotfix;
WhitelistHotfix.description = 'Whitelist a governance hotfix';
WhitelistHotfix.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true, description: "Whitelister's address" }), hash: command_1.flags.string({ required: true, description: 'Hash of hotfix transactions' }) });
WhitelistHotfix.examples = [
    'whitelisthotfix --hash 0x614dccb5ac13cba47c2430bdee7829bb8c8f3603a8ace22e7680d317b39e3658 --from 0x5409ed021d9299bf6814279a6a1411a7e866a631',
];
//# sourceMappingURL=whitelisthotfix.js.map