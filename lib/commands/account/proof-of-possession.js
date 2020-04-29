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
class ProofOfPossession extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ProofOfPossession);
            const accounts = yield this.kit.contracts.getAccounts();
            const pop = yield accounts.generateProofOfKeyPossession(res.flags.account, res.flags.signer);
            cli_1.printValueMap({ signature: signatureUtils_1.serializeSignature(pop) });
        });
    }
}
exports.default = ProofOfPossession;
ProofOfPossession.description = 'Generate proof-of-possession to be used to authorize a signer. See the "account:authorize" command for more details.';
ProofOfPossession.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { signer: command_1.Flags.address({
        required: true,
        description: 'Address of the signer key to prove possession of.',
    }), account: command_1.Flags.address({
        required: true,
        description: 'Address of the account that needs to prove possession of the signer key.',
    }) });
ProofOfPossession.examples = [
    'proof-of-possession --account 0x5409ed021d9299bf6814279a6a1411a7e866a631 --signer 0x6ecbe1db9ef729cbe972c83fb886247691fb6beb',
];
//# sourceMappingURL=proof-of-possession.js.map