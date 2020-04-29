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
class ValidatorGroupCommission extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorGroupCommission);
            if (!(res.flags['queue-update'] || res.flags.apply)) {
                this.error(`Specify action: --apply or --queue-update`);
                return;
            }
            this.kit.defaultAccount = res.flags.from;
            const validators = yield this.kit.contracts.getValidators();
            if (res.flags['queue-update']) {
                const commission = new bignumber_js_1.default(res.flags['queue-update']);
                yield checks_1.newCheckBuilder(this, res.flags.from)
                    .addCheck('Commission is in range [0,1]', () => commission.gte(0) && commission.lte(1))
                    .isSignerOrAccount()
                    .canSignValidatorTxs()
                    // .signerAccountIsValidatorGroup()
                    .runChecks();
                const tx = yield validators.setNextCommissionUpdate(commission);
                yield cli_1.displaySendTx('setNextCommissionUpdate', tx);
            }
            else if (res.flags.apply) {
                yield checks_1.newCheckBuilder(this, res.flags.from)
                    .isSignerOrAccount()
                    .canSignValidatorTxs()
                    // .signerAccountIsValidatorGroup()
                    .hasACommissionUpdateQueued()
                    .hasCommissionUpdateDelayPassed()
                    .runChecks();
                const tx = yield validators.updateCommission();
                yield cli_1.displaySendTx('updateCommission', tx);
            }
        });
    }
}
exports.default = ValidatorGroupCommission;
ValidatorGroupCommission.description = 'Manage the commission for a registered Validator Group. This represents the share of the epoch rewards given to elected Validators that goes to the group they are a member of. Updates must be made in a two step process where the group owner first calls uses the queue-update option, then after the required update delay, the apply option. The commission update delay, in blocks, can be viewed with the network:parameters command. A groups next commission update block can be checked with validatorgroup:show';
ValidatorGroupCommission.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({
        required: true,
        description: 'Address for the Validator Group or Validator Group validator signer',
    }), apply: command_1.flags.boolean({
        exclusive: ['queue-update'],
        description: 'Applies a previously queued update. Should be called after the update delay.',
    }), 'queue-update': command_1.flags.string({
        exclusive: ['apply'],
        description: 'Queues an update to the commission, which can be applied after the update delay.',
    }) });
ValidatorGroupCommission.examples = [
    'commission --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --queue-update 0.1',
    'commission --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --apply',
];
//# sourceMappingURL=commission.js.map