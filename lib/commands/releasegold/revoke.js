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
const prompts_1 = __importDefault(require("prompts"));
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const release_gold_1 = require("./release-gold");
class Revoke extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(Revoke);
            const isRevoked = yield this.releaseGoldWrapper.isRevoked();
            const isRevocable = yield this.releaseGoldWrapper.isRevocable();
            yield checks_1.newCheckBuilder(this)
                .addCheck('Contract is not revoked', () => !isRevoked)
                .addCheck('Contract is revocable', () => isRevocable)
                .runChecks();
            if (!flags.yesreally) {
                const response = yield prompts_1.default({
                    type: 'confirm',
                    name: 'confirmation',
                    message: 'Are you sure you want to revoke this contract? (y/n)',
                });
                if (!response.confirmation) {
                    console.info('Aborting due to user response');
                    process.exit(0);
                }
            }
            this.kit.defaultAccount = yield this.releaseGoldWrapper.getReleaseOwner();
            yield cli_1.displaySendTx('revokeReleasing', yield this.releaseGoldWrapper.revokeReleasing());
        });
    }
}
exports.default = Revoke;
Revoke.description = 'Revoke the given contract instance. Once revoked, any Locked Gold can be unlocked by the release owner. The beneficiary will then be able to withdraw any released Gold that had yet to be withdrawn, and the remainder can be transferred by the release owner to the refund address. Note that not all ReleaseGold instances are revokable.';
Revoke.flags = Object.assign(Object.assign({}, release_gold_1.ReleaseGoldCommand.flags), { yesreally: command_1.flags.boolean({ description: 'Override prompt to set liquidity (be careful!)' }) });
Revoke.args = [];
Revoke.examples = ['revoke --contract 0x5409ED021D9299bf6814279A6A1411A7e866A631'];
//# sourceMappingURL=revoke.js.map