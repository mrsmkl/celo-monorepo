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
const async_1 = require("@celo/utils/lib/async");
const command_1 = require("@oclif/command");
const ethereumjs_util_1 = require("ethereumjs-util");
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
class ViewHotfix extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ViewHotfix);
            const governance = yield this.kit.contracts.getGovernance();
            const hash = ethereumjs_util_1.toBuffer(res.flags.hash);
            const record = yield governance.getHotfixRecord(hash);
            cli_1.printValueMap(record);
            const passing = yield governance.isHotfixPassing(hash);
            cli_1.printValueMap({ passing });
            const tally = yield governance.hotfixWhitelistValidatorTally(hash);
            const quorum = yield governance.minQuorumSize();
            cli_1.printValueMap({
                tally,
                quorum,
            });
            if (res.flags.whitelisters || res.flags.nonwhitelisters) {
                const validators = yield this.kit.contracts.getValidators();
                const accounts = yield validators.currentValidatorAccountsSet();
                const whitelist = yield async_1.concurrentMap(5, accounts, (validator) => __awaiter(this, void 0, void 0, function* () {
                    return (yield governance.isHotfixWhitelistedBy(hash, validator.signer)) ||
                        /* tslint:disable-next-line no-return-await */
                        (yield governance.isHotfixWhitelistedBy(hash, validator.account));
                }));
                cli_1.printValueMapRecursive({
                    Validators: accounts.filter((_, idx) => !!res.flags.whitelisters === whitelist[idx]),
                });
            }
        });
    }
}
exports.default = ViewHotfix;
ViewHotfix.description = 'View information associated with hotfix';
ViewHotfix.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses()), { hash: command_1.flags.string({ required: true, description: 'Hash of hotfix transactions' }), whitelisters: command_1.flags.boolean({
        description: 'If set, displays validators that have whitelisted the hotfix.',
        exclusive: ['nonwhitelisters'],
    }), nonwhitelisters: command_1.flags.boolean({
        description: 'If set, displays validators that have not whitelisted the hotfix.',
        exclusive: ['whitelisters'],
    }) });
ViewHotfix.examples = [
    'viewhotfix --hash 0x614dccb5ac13cba47c2430bdee7829bb8c8f3603a8ace22e7680d317b39e3658',
    'viewhotfix --hash 0x614dccb5ac13cba47c2430bdee7829bb8c8f3603a8ace22e7680d317b39e3658 --whitelisters',
    'viewhotfix --hash 0x614dccb5ac13cba47c2430bdee7829bb8c8f3603a8ace22e7680d317b39e3658 --nonwhitelisters',
];
//# sourceMappingURL=viewhotfix.js.map