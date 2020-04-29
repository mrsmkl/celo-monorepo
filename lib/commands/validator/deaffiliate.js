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
class ValidatorDeAffiliate extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorDeAffiliate);
            this.kit.defaultAccount = res.flags.from;
            const validators = yield this.kit.contracts.getValidators();
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isSignerOrAccount()
                .canSignValidatorTxs()
                .signerAccountIsValidator()
                .runChecks();
            yield cli_1.displaySendTx('deaffiliate', validators.deaffiliate());
        });
    }
}
exports.default = ValidatorDeAffiliate;
ValidatorDeAffiliate.description = 'Deaffiliate a Validator from a Validator Group, and remove it from the Group if it is also a member.';
ValidatorDeAffiliate.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({ required: true, description: "Signer or Validator's address" }) });
ValidatorDeAffiliate.examples = ['deaffiliate --from 0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95'];
//# sourceMappingURL=deaffiliate.js.map