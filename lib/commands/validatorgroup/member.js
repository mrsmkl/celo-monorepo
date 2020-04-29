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
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class ValidatorGroupMembers extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorGroupMembers);
            if (!(res.flags.accept || res.flags.remove || typeof res.flags.reorder === 'number')) {
                this.error(`Specify action: --accept, --remove or --reorder`);
                return;
            }
            this.kit.defaultAccount = res.flags.from;
            const validators = yield this.kit.contracts.getValidators();
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isSignerOrAccount()
                .canSignValidatorTxs()
                .signerAccountIsValidatorGroup()
                .isValidator(res.args.validatorAddress)
                .runChecks();
            const validatorGroup = yield validators.signerToAccount(res.flags.from);
            if (res.flags.accept) {
                const response = yield prompts_1.default({
                    type: 'confirm',
                    name: 'confirmation',
                    message: 'Are you sure you want to accept this member?\nValidator Group Locked Gold requirements increase per member. Adding an additional member could result in an increase in Locked Gold requirements of up to 10,000 cGLD for 180 days. (y/n)',
                });
                if (!response.confirmation) {
                    console.info('Aborting due to user response');
                    process.exit(0);
                }
                const tx = yield validators.addMember(validatorGroup, res.args.validatorAddress);
                yield cli_1.displaySendTx('addMember', tx);
            }
            else if (res.flags.remove) {
                yield cli_1.displaySendTx('removeMember', validators.removeMember(res.args.validatorAddress));
            }
            else if (res.flags.reorder != null) {
                yield cli_1.displaySendTx('reorderMember', yield validators.reorderMember(validatorGroup, res.args.validatorAddress, res.flags.reorder));
            }
        });
    }
}
exports.default = ValidatorGroupMembers;
ValidatorGroupMembers.description = 'Add or remove members from a Validator Group';
ValidatorGroupMembers.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true, description: "ValidatorGroup's address" }), accept: command_1.flags.boolean({
        exclusive: ['remove', 'reorder'],
        description: 'Accept a validator whose affiliation is already set to the group',
    }), remove: command_1.flags.boolean({
        exclusive: ['accept', 'reorder'],
        description: 'Remove a validator from the members list',
    }), reorder: command_1.flags.integer({
        exclusive: ['accept', 'remove'],
        description: 'Reorder a validator within the members list. Indices are 0 based',
    }) });
ValidatorGroupMembers.args = [command_2.Args.address('validatorAddress', { description: "Validator's address" })];
ValidatorGroupMembers.examples = [
    'member --from 0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95 --accept 0x97f7333c51897469e8d98e7af8653aab468050a3',
    'member --from 0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95 --remove 0x97f7333c51897469e8d98e7af8653aab468050a3',
    'member --from 0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95 --reorder 3 0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95',
];
//# sourceMappingURL=member.js.map