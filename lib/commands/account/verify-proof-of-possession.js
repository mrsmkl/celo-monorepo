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
const signatureUtils_1 = require("@celo/utils/lib/signatureUtils");
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
class VerifyProofOfPossession extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(VerifyProofOfPossession);
            const accounts = yield this.kit.contracts.getAccounts();
            let valid = false;
            let signature = res.flags.signature;
            try {
                const { v, r, s } = accounts.parseSignatureOfAddress(res.flags.account, res.flags.signer, res.flags.signature);
                signature = signatureUtils_1.serializeSignature({ v, r, s });
                valid = true;
            }
            catch (error) {
                console.error('Error: Failed to parse signature');
            }
            cli_1.printValueMap({
                valid: valid,
                signature: signature,
            });
        });
    }
}
exports.default = VerifyProofOfPossession;
VerifyProofOfPossession.description = 'Verify a proof-of-possession. See the "account:proof-of-possession" command for more details.';
VerifyProofOfPossession.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { signer: command_1.Flags.address({
        required: true,
        description: 'Address of the signer key to verify proof of possession.',
    }), account: command_1.Flags.address({
        required: true,
        description: 'Address of the account that needs to prove possession of the signer key.',
    }), signature: command_1.Flags.proofOfPossession({
        required: true,
        description: 'Signature (a.k.a. proof-of-possession) of the signer key',
    }) });
VerifyProofOfPossession.examples = [
    'verify-proof-of-possession --account 0x199eDF79ABCa29A2Fa4014882d3C13dC191A5B58 --signer 0x0EdeDF7B1287f07db348997663EeEb283D70aBE7 --signature 0x1c5efaa1f7ca6484d49ccce76217e2fba0552c0b23462cff7ba646473bc2717ffc4ce45be89bd5be9b5d23305e87fc2896808467c4081d9524a84c01b89ec91ca3',
];
//# sourceMappingURL=verify-proof-of-possession.js.map