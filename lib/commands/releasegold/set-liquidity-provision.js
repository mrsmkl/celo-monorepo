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
class SetLiquidityProvision extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(SetLiquidityProvision);
            yield checks_1.newCheckBuilder(this)
                .addCheck('The liquidity provision has not already been set', () => __awaiter(this, void 0, void 0, function* () {
                const liquidityProvisionMet = yield this.releaseGoldWrapper.getLiquidityProvisionMet();
                return !liquidityProvisionMet;
            }))
                .runChecks();
            if (!flags.yesreally) {
                const response = yield prompts_1.default({
                    type: 'confirm',
                    name: 'confirmation',
                    message: 'Are you sure you want to enable the liquidity provision? (y/n)',
                });
                if (!response.confirmation) {
                    console.info('Aborting due to user response');
                    process.exit(0);
                }
            }
            this.kit.defaultAccount = yield this.releaseGoldWrapper.getReleaseOwner();
            yield cli_1.displaySendTx('setLiquidityProvision', this.releaseGoldWrapper.setLiquidityProvision());
        });
    }
}
exports.default = SetLiquidityProvision;
SetLiquidityProvision.description = 'Set the liquidity provision to true, allowing the beneficiary to withdraw released gold.';
SetLiquidityProvision.flags = Object.assign(Object.assign({}, release_gold_1.ReleaseGoldCommand.flags), { yesreally: command_1.flags.boolean({ description: 'Override prompt to set liquidity (be careful!)' }) });
SetLiquidityProvision.args = [];
SetLiquidityProvision.examples = [
    'set-liquidity-provision --contract 0x5409ED021D9299bf6814279A6A1411A7e866A631',
];
//# sourceMappingURL=set-liquidity-provision.js.map