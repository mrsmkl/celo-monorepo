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
const base_1 = require("../../base");
const command_1 = require("../../utils/command");
const identity_2 = require("../../utils/identity");
class GetMetadata extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args } = this.parse(GetMetadata);
            const address = args.address;
            const accounts = yield this.kit.contracts.getAccounts();
            const metadataURL = yield accounts.getMetadataURL(address);
            if (!metadataURL) {
                console.info('No metadata set for address');
                return;
            }
            try {
                const metadata = yield identity_1.IdentityMetadataWrapper.fetchFromURL(this.kit, metadataURL);
                console.info('Metadata contains the following claims: \n');
                yield identity_2.displayMetadata(metadata, this.kit);
            }
            catch (error) {
                console.error(`Metadata could not be retrieved from ${metadataURL}: ${error.toString()}`);
            }
        });
    }
}
exports.default = GetMetadata;
GetMetadata.description = 'Show information about an address. Retreives the metadata URL for an account from the on-chain, then fetches the metadata file off-chain and verifies proofs as able.';
GetMetadata.flags = Object.assign({}, base_1.BaseCommand.flags);
GetMetadata.args = [command_1.Args.address('address', { description: 'Address to get metadata for' })];
GetMetadata.examples = ['get-metadata 0x97f7333c51897469E8D98E7af8653aAb468050a3'];
//# sourceMappingURL=get-metadata.js.map