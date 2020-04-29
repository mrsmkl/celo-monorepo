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
class ValidatorForceDeaffiliate extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorForceDeaffiliate);
            this.kit.defaultAccount = res.flags.from;
            const validators = yield this.kit.contracts.getValidators();
            yield checks_1.newCheckBuilder(this, res.flags.validator)
                .isSignerOrAccount()
                .canSignValidatorTxs()
                .signerAccountIsValidator()
                .runChecks();
            yield cli_1.displaySendTx('force-deaffiliate', validators.forceDeaffiliateIfValidator(res.flags.validator));
        });
    }
}
exports.default = ValidatorForceDeaffiliate;
ValidatorForceDeaffiliate.description = "Force deaffiliate a Validator from a Validator Group, and remove it from the Group if it is also a member.  Used by stake-off admins in order to remove validators from the next epoch's validator set if they are down and consistently unresponsive, in order to preserve the health of the network. This feature will be removed once slashing for downtime is implemented.";
ValidatorForceDeaffiliate.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({ required: true, description: 'Initiator' }), validator: command_1.Flags.address({ required: true, description: "Validator's address" }) });
ValidatorForceDeaffiliate.examples = [
    'force-deaffiliate --from 0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95 --validator 0xb7ef0985bdb4f19460A29d9829aA1514B181C4CD',
];
//# sourceMappingURL=force-deaffiliate.js.map