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
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class ValidatorGroupRegister extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorGroupRegister);
            this.kit.defaultAccount = res.flags.from;
            const validators = yield this.kit.contracts.getValidators();
            const commission = new bignumber_js_1.default(res.flags.commission);
            if (!res.flags.yes) {
                const requirements = yield validators.getGroupLockedGoldRequirements();
                const duration = requirements.duration.toNumber() * 1000;
                const check = yield cli_1.binaryPrompt(`This will lock ${requirements.value.shiftedBy(-18)} cGLD for ${humanize_duration_1.default(duration)}. Are you sure you want to continue?`, true);
                if (!check) {
                    console.log('Cancelled');
                    return;
                }
            }
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .addCheck('Commission is in range [0,1]', () => commission.gte(0) && commission.lte(1))
                .isSignerOrAccount()
                .canSignValidatorTxs()
                .isNotValidator()
                .isNotValidatorGroup()
                .signerMeetsValidatorGroupBalanceRequirements()
                .runChecks();
            const tx = yield validators.registerValidatorGroup(commission);
            yield cli_1.displaySendTx('registerValidatorGroup', tx);
        });
    }
}
exports.default = ValidatorGroupRegister;
ValidatorGroupRegister.description = 'Register a new Validator Group';
ValidatorGroupRegister.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true, description: 'Address for the Validator Group' }), yes: command_1.flags.boolean({ description: 'Answer yes to prompt' }), commission: command_1.flags.string({
        required: true,
        description: 'The share of the epoch rewards given to elected Validators that goes to the group.',
    }) });
ValidatorGroupRegister.examples = ['register --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --commission 0.1'];
//# sourceMappingURL=register.js.map