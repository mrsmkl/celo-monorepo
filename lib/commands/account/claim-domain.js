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
const claim_1 = require("@celo/contractkit/lib/identity/claims/claim");
const command_1 = require("@oclif/command");
const identity_1 = require("../../utils/identity");
class ClaimDomain extends identity_1.ClaimCommand {
    constructor() {
        super(...arguments);
        this.self = ClaimDomain;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ClaimDomain);
            const metadata = yield this.readMetadata();
            // If the domain claim already exists we return the existing one allowing to generate always the same
            // signature for the same domain name
            const addedClaim = yield this.addClaim(metadata, claim_1.createDomainClaim(res.flags.domain));
            this.writeMetadata(metadata);
            const signature = yield this.signer.sign(claim_1.serializeClaim(addedClaim));
            const signatureBase64 = Buffer.from(signature.toString(), 'binary').toString('base64');
            console.info('Please add the following TXT record to your domain:');
            console.info('celo-site-verification=' + signatureBase64 + '\n');
        });
    }
}
exports.default = ClaimDomain;
ClaimDomain.description = 'Claim a domain and add the claim to a local metadata file';
ClaimDomain.flags = Object.assign(Object.assign({}, identity_1.ClaimCommand.flags), { domain: command_1.flags.string({
        required: true,
        description: 'The domain you want to claim',
    }) });
ClaimDomain.args = identity_1.ClaimCommand.args;
ClaimDomain.examples = [
    'claim-domain ~/metadata.json --domain test.com --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95',
];
//# sourceMappingURL=claim-domain.js.map