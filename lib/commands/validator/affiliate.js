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
const prompts_1 = __importDefault(require("prompts"));
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
class ValidatorAffiliate extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorAffiliate);
            this.kit.defaultAccount = res.flags.from;
            const validators = yield this.kit.contracts.getValidators();
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isSignerOrAccount()
                .canSignValidatorTxs()
                .signerAccountIsValidator()
                .isValidatorGroup(res.args.groupAddress)
                .runChecks();
            const response = yield prompts_1.default({
                type: 'confirm',
                name: 'confirmation',
                message: 'Are you sure you want to affiliate with this group?\nAffiliating with a Validator Group could result in Locked Gold requirements of up to 10,000 cGLD for 60 days. (y/n)',
            });
            if (!response.confirmation) {
                console.info('Aborting due to user response');
                process.exit(0);
            }
            yield cli_1.displaySendTx('affiliate', validators.affiliate(res.args.groupAddress));
        });
    }
}
exports.default = ValidatorAffiliate;
ValidatorAffiliate.description = "Affiliate a Validator with a Validator Group. This allows the Validator Group to add that Validator as a member. If the Validator is already a member of a Validator Group, affiliating with a different Group will remove the Validator from the first group's members.";
ValidatorAffiliate.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({ required: true, description: "Signer or Validator's address" }) });
ValidatorAffiliate.args = [
    command_1.Args.address('groupAddress', { description: "ValidatorGroup's address", required: true }),
];
ValidatorAffiliate.examples = [
    'affiliate --from 0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95 0x97f7333c51897469e8d98e7af8653aab468050a3',
];
//# sourceMappingURL=affiliate.js.map