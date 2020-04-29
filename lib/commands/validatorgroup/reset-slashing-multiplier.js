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
class ResetSlashingMultiplier extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args } = this.parse(ResetSlashingMultiplier);
            const address = args.groupAddress;
            const validators = yield this.kit.contracts.getValidators();
            this.kit.defaultAccount = address;
            yield checks_1.newCheckBuilder(this, address)
                .isSignerOrAccount()
                .canSignValidatorTxs()
                .signerAccountIsValidatorGroup()
                .resetSlashingmultiplierPeriodPassed()
                .runChecks();
            yield cli_1.displaySendTx('reset-slashing-multiplier', validators.resetSlashingMultiplier());
        });
    }
}
exports.default = ResetSlashingMultiplier;
ResetSlashingMultiplier.description = 'Reset validator group slashing multiplier.';
ResetSlashingMultiplier.flags = Object.assign({}, base_1.BaseCommand.flags);
ResetSlashingMultiplier.args = [command_1.Args.address('groupAddress', { description: "ValidatorGroup's address" })];
ResetSlashingMultiplier.examples = ['reset-slashing-multiplier 0x97f7333c51897469E8D98E7af8653aAb468050a3'];
//# sourceMappingURL=reset-slashing-multiplier.js.map