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
const command_1 = require("@oclif/command");
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class Authorize extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Authorize);
            this.kit.defaultAccount = res.flags.from;
            const accounts = yield this.kit.contracts.getAccounts();
            const sig = accounts.parseSignatureOfAddress(res.flags.from, res.flags.signer, res.flags.signature);
            yield checks_1.newCheckBuilder(this)
                .isAccount(res.flags.from)
                .runChecks();
            let tx;
            if (res.flags.role === 'vote') {
                tx = yield accounts.authorizeVoteSigner(res.flags.signer, sig);
            }
            else if (res.flags.role === 'validator' && res.flags.blsKey) {
                tx = yield accounts.authorizeValidatorSignerAndBls(res.flags.signer, sig, res.flags.blsKey, res.flags.blsPop);
            }
            else if (res.flags.role === 'validator') {
                tx = yield accounts.authorizeValidatorSigner(res.flags.signer, sig);
            }
            else if (res.flags.role === 'attestation') {
                tx = yield accounts.authorizeAttestationSigner(res.flags.signer, sig);
            }
            else {
                this.error(`Invalid role provided`);
                return;
            }
            yield cli_1.displaySendTx('authorizeTx', tx);
        });
    }
}
exports.default = Authorize;
Authorize.description = 'Keep your locked Gold more secure by authorizing alternative keys to be used for signing attestations, voting, or validating. By doing so, you can continue to participate in the protocol while keeping the key with access to your locked Gold in cold storage. You must include a "proof-of-possession" of the key being authorized, which can be generated with the "account:proof-of-possession" command.';
Authorize.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true }), role: command_1.flags.string({
        char: 'r',
        options: ['vote', 'validator', 'attestation'],
        description: 'Role to delegate',
        required: true,
    }), signature: command_2.Flags.proofOfPossession({
        description: 'Signature (a.k.a proof-of-possession) of the signer key',
        required: true,
    }), signer: command_2.Flags.address({ required: true }), blsKey: command_2.Flags.blsPublicKey({
        description: 'The BLS public key that the validator is using for consensus, should pass proof of possession. 96 bytes.',
    }), blsPop: command_2.Flags.blsProofOfPossession({
        description: 'The BLS public key proof-of-possession, which consists of a signature on the account address. 48 bytes.',
    }) });
Authorize.args = [];
Authorize.examples = [
    'authorize --from 0x5409ED021D9299bf6814279A6A1411A7e866A631 --role vote --signer 0x6ecbe1db9ef729cbe972c83fb886247691fb6beb --signature 0x1b9fca4bbb5bfb1dbe69ef1cddbd9b4202dcb6b134c5170611e1e36ecfa468d7b46c85328d504934fce6c2a1571603a50ae224d2b32685e84d4d1a1eebad8452eb',
    'authorize --from 0x5409ED021D9299bf6814279A6A1411A7e866A631 --role vote --signer 0x6ecbe1db9ef729cbe972c83fb886247691fb6beb --signature 0x1b9fca4bbb5bfb1dbe69ef1cddbd9b4202dcb6b134c5170611e1e36ecfa468d7b46c85328d504934fce6c2a1571603a50ae224d2b32685e84d4d1a1eebad8452eb --blsKey 0x4fa3f67fc913878b068d1fa1cdddc54913d3bf988dbe5a36a20fa888f20d4894c408a6773f3d7bde11154f2a3076b700d345a42fd25a0e5e83f4db5586ac7979ac2053cd95d8f2efd3e959571ceccaa743e02cf4be3f5d7aaddb0b06fc9aff00 --blsPop 0xcdb77255037eb68897cd487fdd85388cbda448f617f874449d4b11588b0b7ad8ddc20d9bb450b513bb35664ea3923900',
];
//# sourceMappingURL=authorize.js.map