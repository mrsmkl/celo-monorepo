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
const attestation_service_url_1 = require("@celo/contractkit/lib/identity/claims/attestation-service-url");
const command_1 = require("../../utils/command");
const identity_1 = require("../../utils/identity");
class ClaimAttestationServiceUrl extends identity_1.ClaimCommand {
    constructor() {
        super(...arguments);
        this.self = ClaimAttestationServiceUrl;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ClaimAttestationServiceUrl);
            const metadata = yield this.readMetadata();
            yield this.addClaim(metadata, attestation_service_url_1.createAttestationServiceURLClaim(res.flags.url));
            this.writeMetadata(metadata);
        });
    }
}
exports.default = ClaimAttestationServiceUrl;
ClaimAttestationServiceUrl.description = 'Claim the URL of the attestation service and add the claim to a local metadata file';
ClaimAttestationServiceUrl.flags = Object.assign(Object.assign({}, identity_1.ClaimCommand.flags), { url: command_1.Flags.url({
        required: true,
        description: 'The url you want to claim',
    }) });
ClaimAttestationServiceUrl.args = identity_1.ClaimCommand.args;
ClaimAttestationServiceUrl.examples = [
    'claim-attestation-service-url ~/metadata.json --url http://test.com/myurl --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95',
];
//# sourceMappingURL=claim-attestation-service-url.js.map