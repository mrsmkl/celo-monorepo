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
const identity_1 = require("@celo/contractkit/lib/identity");
const fs_1 = require("fs");
const command_1 = require("../../utils/command");
const identity_2 = require("../../utils/identity");
class CreateMetadata extends identity_2.ClaimCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(CreateMetadata);
            const metadata = identity_1.IdentityMetadataWrapper.fromEmpty(res.flags.from);
            fs_1.writeFileSync(res.args.file, metadata.toString());
        });
    }
}
exports.default = CreateMetadata;
CreateMetadata.description = 'Create an empty identity metadata file. Use this metadata file to store claims attesting to ownership of off-chain resources. Claims can be generated with the account:claim-* commands.';
CreateMetadata.flags = identity_2.ClaimCommand.flags;
CreateMetadata.args = [
    command_1.Args.newFile('file', { description: 'Path where the metadata should be saved' }),
];
CreateMetadata.examples = [
    'create-metadata ~/metadata.json --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95',
];
//# sourceMappingURL=create-metadata.js.map