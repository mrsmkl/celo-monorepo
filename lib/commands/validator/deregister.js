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
class ValidatorDeregister extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorDeregister);
            this.kit.defaultAccount = res.flags.from;
            const validators = yield this.kit.contracts.getValidators();
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isSignerOrAccount()
                .canSignValidatorTxs()
                .signerAccountIsValidator()
                .isNotValidatorGroupMember()
                .validatorDeregisterDurationPassed()
                .runChecks();
            const validator = yield validators.signerToAccount(res.flags.from);
            yield cli_1.displaySendTx('deregister', yield validators.deregisterValidator(validator));
        });
    }
}
exports.default = ValidatorDeregister;
ValidatorDeregister.description = 'Deregister a Validator. Approximately 60 days after deregistration, the 10,000 Gold locked up to register the Validator will become possible to unlock. Note that deregistering a Validator will also deaffiliate and remove the Validator from any Group it may be an affiliate or member of.';
ValidatorDeregister.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({ required: true, description: "Signer or Validator's address" }) });
ValidatorDeregister.examples = ['deregister --from 0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95'];
//# sourceMappingURL=deregister.js.map