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
class ClaimName extends identity_1.ClaimCommand {
    constructor() {
        super(...arguments);
        this.self = ClaimName;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ClaimName);
            const metadata = yield this.readMetadata();
            yield this.addClaim(metadata, claim_1.createNameClaim(res.flags.name));
            this.writeMetadata(metadata);
        });
    }
}
exports.default = ClaimName;
ClaimName.description = 'Claim a name and add the claim to a local metadata file';
ClaimName.flags = Object.assign(Object.assign({}, identity_1.ClaimCommand.flags), { name: command_1.flags.string({
        required: true,
        description: 'The name you want to claim',
    }) });
ClaimName.args = identity_1.ClaimCommand.args;
ClaimName.examples = [
    'claim-name ~/metadata.json --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --name myname',
];
//# sourceMappingURL=claim-name.js.map