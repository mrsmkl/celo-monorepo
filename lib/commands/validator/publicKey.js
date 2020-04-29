"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
const helpers_1 = require("../../utils/helpers");
class ValidatorPublicKey extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorPublicKey);
            this.kit.defaultAccount = res.flags.from;
            const validators = yield this.kit.contracts.getValidators();
            const accounts = yield this.kit.contracts.getAccounts();
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isSignerOrAccount()
                .canSignValidatorTxs()
                .signerAccountIsValidator()
                .runChecks();
            yield cli_1.displaySendTx('updatePublicKeysData', validators.updatePublicKeysData(res.flags.publicKey));
            // register encryption key on accounts contract
            // TODO: Use a different key data encryption
            const pubKey = yield helpers_1.getPubKeyFromAddrAndWeb3(res.flags.from, this.web3);
            // TODO fix typing
            const setKeyTx = accounts.setAccountDataEncryptionKey(pubKey);
            yield cli_1.displaySendTx('Set encryption key', setKeyTx);
        });
    }
}
ValidatorPublicKey.description = 'Manage BLS public key data for a validator';
ValidatorPublicKey.flags = Object.assign({}, base_1.BaseCommand.flags, { from: command_1.Flags.address({ required: true, description: "Validator's address" }), publicKey: command_1.Flags.publicKey({ required: true }) });
ValidatorPublicKey.examples = [
    'publickey --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --publicKey 0xc52f3fab06e22a54915a8765c4f6826090cfac5e40282b43844bf1c0df83aaa632e55b67869758f2291d1aabe0ebecc7cbf4236aaa45e3e0cfbf997eda082ae19d3e1d8f49f6b0d8e9a03d80ca07b1d24cf1cc0557bdcc04f5e17a46e35d02d0d411d956dbd5d2d2464eebd7b74ae30005d223780d785d2abc5644fac7ac29fb0e302bdc80c81a5d45018b68b1045068a4b3a4861c93037685fd0d252d7405011220a66a6257562d0c26dabf64485a1d96bad27bb1c0fd6080a75b0ec9f75b50298a2a8e04b02b2688c8104fca61fb00',
];
exports.default = ValidatorPublicKey;
//# sourceMappingURL=publicKey.js.map