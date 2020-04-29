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
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
const release_gold_1 = require("./release-gold");
class Authorize extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(Authorize);
            const role = flags.role;
            yield checks_1.newCheckBuilder(this)
                .isAccount(this.releaseGoldWrapper.address)
                .runChecks();
            const accounts = yield this.kit.contracts.getAccounts();
            const sig = accounts.parseSignatureOfAddress(this.releaseGoldWrapper.address, flags.signer, flags.signature);
            const isRevoked = yield this.releaseGoldWrapper.isRevoked();
            this.kit.defaultAccount = isRevoked
                ? yield this.releaseGoldWrapper.getReleaseOwner()
                : yield this.releaseGoldWrapper.getBeneficiary();
            let tx;
            if (role === 'vote') {
                tx = yield this.releaseGoldWrapper.authorizeVoteSigner(flags.signer, sig);
            }
            else if (role === 'validator' && flags.blsKey) {
                tx = yield this.releaseGoldWrapper.authorizeValidatorSignerAndBls(flags.signer, sig, flags.blsKey, flags.blsPop);
            }
            else if (role === 'validator') {
                tx = yield this.releaseGoldWrapper.authorizeValidatorSigner(flags.signer, sig);
            }
            else if (role === 'attestation') {
                tx = yield this.releaseGoldWrapper.authorizeAttestationSigner(flags.signer, sig);
            }
            else {
                this.error('Invalid role provided');
                return;
            }
            yield cli_1.displaySendTx('authorize' + role + 'Tx', tx);
        });
    }
}
exports.default = Authorize;
Authorize.description = 'Authorize an alternative key to be used for a given action (Vote, Validate, Attest) on behalf of the ReleaseGold instance contract.';
Authorize.flags = Object.assign(Object.assign({}, release_gold_1.ReleaseGoldCommand.flags), { role: command_1.flags.string({ required: true, options: ['vote', 'validator', 'attestation'] }), signer: command_2.Flags.address({
        required: true,
        description: 'The signer key that is to be used for voting through the ReleaseGold instance',
    }), signature: command_2.Flags.proofOfPossession({
        description: 'Signature (a.k.a. proof-of-possession) of the signer key',
        required: true,
    }), blsKey: command_2.Flags.blsPublicKey({
        description: 'The BLS public key that the validator is using for consensus, should pass proof of possession. 96 bytes.',
    }), blsPop: command_2.Flags.blsProofOfPossession({
        description: 'The BLS public key proof-of-possession, which consists of a signature on the account address. 48 bytes.',
    }) });
Authorize.args = [];
Authorize.examples = [
    'authorize --contract 0x5409ED021D9299bf6814279A6A1411A7e866A631 --role vote --signer 0x6ecbe1db9ef729cbe972c83fb886247691fb6beb --signature 0x1b9fca4bbb5bfb1dbe69ef1cddbd9b4202dcb6b134c5170611e1e36ecfa468d7b46c85328d504934fce6c2a1571603a50ae224d2b32685e84d4d1a1eebad8452eb',
    'authorize --contract 0x5409ED021D9299bf6814279A6A1411A7e866A631 --role validator --signer 0x6ecbe1db9ef729cbe972c83fb886247691fb6beb --signature 0x1b9fca4bbb5bfb1dbe69ef1cddbd9b4202dcb6b134c5170611e1e36ecfa468d7b46c85328d504934fce6c2a1571603a50ae224d2b32685e84d4d1a1eebad8452eb',
    'authorize --contract 0x5409ED021D9299bf6814279A6A1411A7e866A631 --role attestation --signer 0x6ecbe1db9ef729cbe972c83fb886247691fb6beb --signature 0x1b9fca4bbb5bfb1dbe69ef1cddbd9b4202dcb6b134c5170611e1e36ecfa468d7b46c85328d504934fce6c2a1571603a50ae224d2b32685e84d4d1a1eebad8452eb',
];
//# sourceMappingURL=authorize.js.map