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
const command_1 = require("@oclif/command");
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
const identity_2 = require("../../utils/identity");
class RegisterMetadata extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(RegisterMetadata);
            this.kit.defaultAccount = res.flags.from;
            yield checks_1.newCheckBuilder(this)
                .isAccount(res.flags.from)
                .runChecks();
            const metadataURL = res.flags.url;
            if (!res.flags.force) {
                try {
                    const metadata = yield identity_1.IdentityMetadataWrapper.fetchFromURL(this.kit, metadataURL);
                    console.info('Metadata contains the following claims: \n');
                    yield identity_2.displayMetadata(metadata, this.kit);
                    console.info(); // Print a newline.
                }
                catch (error) {
                    console.error(`Metadata could not be retrieved from ${metadataURL}: ${error.toString()}`);
                    console.info('Exiting without performing changes...');
                    process.exit(-1);
                }
            }
            const accounts = yield this.kit.contracts.getAccounts();
            yield cli_1.displaySendTx('registerMetadata', accounts.setMetadataURL(metadataURL));
        });
    }
}
exports.default = RegisterMetadata;
RegisterMetadata.description = 'Register metadata URL for an account where users will be able to retieve the metadata file and verify your claims';
RegisterMetadata.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({
        required: true,
        description: 'Addess of the account to set metadata for',
    }), url: command_2.Flags.url({
        required: true,
        description: 'The url to the metadata you want to register',
    }), force: command_1.flags.boolean({ description: 'Ignore metadata validity checks' }) });
RegisterMetadata.examples = [
    'register-metadata --url https://www.mywebsite.com/celo-metadata --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95',
];
//# sourceMappingURL=register-metadata.js.map