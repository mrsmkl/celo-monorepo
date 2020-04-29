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
const account_1 = require("@celo/contractkit/lib/identity/claims/account");
const command_1 = require("@oclif/command");
const identity_1 = require("../../utils/identity");
class ClaimAccount extends identity_1.ClaimCommand {
    constructor() {
        super(...arguments);
        this.self = ClaimAccount;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ClaimAccount);
            const metadata = yield this.readMetadata();
            yield this.addClaim(metadata, account_1.createAccountClaim(res.flags.address, res.flags.publicKey));
            this.writeMetadata(metadata);
        });
    }
}
exports.default = ClaimAccount;
ClaimAccount.description = 'Claim another account, and optionally its public key, and add the claim to a local metadata file';
ClaimAccount.flags = Object.assign(Object.assign({}, identity_1.ClaimCommand.flags), { address: command_1.flags.string({
        required: true,
        description: 'The address of the account you want to claim',
    }), publicKey: command_1.flags.string({
        default: undefined,
        description: 'The public key of the account that others may use to send you encrypted messages',
    }) });
ClaimAccount.args = identity_1.ClaimCommand.args;
ClaimAccount.examples = [
    'claim-account ~/metadata.json --address 0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95',
];
//# sourceMappingURL=claim-account.js.map