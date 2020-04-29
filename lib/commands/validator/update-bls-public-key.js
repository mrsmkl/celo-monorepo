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
class ValidatorUpdateBlsPublicKey extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorUpdateBlsPublicKey);
            this.kit.defaultAccount = res.flags.from;
            const validators = yield this.kit.contracts.getValidators();
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isSignerOrAccount()
                .canSignValidatorTxs()
                .signerAccountIsValidator()
                .runChecks();
            yield cli_1.displaySendTx('updateBlsPublicKey', validators.updateBlsPublicKey(res.flags.blsKey, res.flags.blsPop));
        });
    }
}
exports.default = ValidatorUpdateBlsPublicKey;
ValidatorUpdateBlsPublicKey.description = 'Update the BLS public key for a Validator to be used in consensus. Regular (ECDSA and BLS) key rotation is recommended for Validator operational security.';
ValidatorUpdateBlsPublicKey.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({ required: true, description: "Validator's address" }), blsKey: command_1.Flags.blsPublicKey({ required: true }), blsPop: command_1.Flags.blsProofOfPossession({ required: true }) });
ValidatorUpdateBlsPublicKey.examples = [
    'update-bls-key --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --blsKey 0x4fa3f67fc913878b068d1fa1cdddc54913d3bf988dbe5a36a20fa888f20d4894c408a6773f3d7bde11154f2a3076b700d345a42fd25a0e5e83f4db5586ac7979ac2053cd95d8f2efd3e959571ceccaa743e02cf4be3f5d7aaddb0b06fc9aff00 --blsPop 0xcdb77255037eb68897cd487fdd85388cbda448f617f874449d4b11588b0b7ad8ddc20d9bb450b513bb35664ea3923900',
];
//# sourceMappingURL=update-bls-public-key.js.map