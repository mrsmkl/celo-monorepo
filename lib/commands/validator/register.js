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
const signatureUtils_1 = require("@celo/utils/lib/signatureUtils");
const command_1 = require("@oclif/command");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class ValidatorRegister extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorRegister);
            this.kit.defaultAccount = res.flags.from;
            const validators = yield this.kit.contracts.getValidators();
            const accounts = yield this.kit.contracts.getAccounts();
            if (!res.flags.yes) {
                const requirements = yield validators.getValidatorLockedGoldRequirements();
                const duration = requirements.duration.toNumber() * 1000;
                const check = yield cli_1.binaryPrompt(`This will lock ${requirements.value.shiftedBy(-18)} cGLD for ${humanize_duration_1.default(duration)}. Are you sure you want to continue?`, true);
                if (!check) {
                    console.log('Cancelled');
                    return;
                }
            }
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isSignerOrAccount()
                .canSignValidatorTxs()
                .isNotValidator()
                .isNotValidatorGroup()
                .signerMeetsValidatorBalanceRequirements()
                .runChecks();
            yield cli_1.displaySendTx('registerValidator', validators.registerValidator(
            // @ts-ignore incorrect typing for bytes type
            res.flags.ecdsaKey, res.flags.blsKey, res.flags.blsSignature));
            // register encryption key on accounts contract
            // TODO: Use a different key data encryption
            const pubKey = yield signatureUtils_1.addressToPublicKey(res.flags.from, this.web3.eth.sign);
            // TODO fix typing
            const setKeyTx = accounts.setAccountDataEncryptionKey(pubKey);
            yield cli_1.displaySendTx('Set encryption key', setKeyTx);
        });
    }
}
exports.default = ValidatorRegister;
ValidatorRegister.description = 'Register a new Validator';
ValidatorRegister.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true, description: 'Address for the Validator' }), ecdsaKey: command_2.Flags.ecdsaPublicKey({ required: true }), blsKey: command_2.Flags.blsPublicKey({ required: true }), blsSignature: command_2.Flags.blsProofOfPossession({ required: true }), yes: command_1.flags.boolean({ description: 'Answer yes to prompt' }) });
ValidatorRegister.examples = [
    'register --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --ecdsaKey 0x049b7291ab8813a095d6b7913a7930ede5ea17466abd5e1a26c6c44f6df9a400a6f474080098b2c752c6c4871978ca977b90dcd3aed92bc9d564137c8dfa14ee72 --blsKey 0x4fa3f67fc913878b068d1fa1cdddc54913d3bf988dbe5a36a20fa888f20d4894c408a6773f3d7bde11154f2a3076b700d345a42fd25a0e5e83f4db5586ac7979ac2053cd95d8f2efd3e959571ceccaa743e02cf4be3f5d7aaddb0b06fc9aff00 --blsSignature 0xcdb77255037eb68897cd487fdd85388cbda448f617f874449d4b11588b0b7ad8ddc20d9bb450b513bb35664ea3923900',
];
//# sourceMappingURL=register.js.map