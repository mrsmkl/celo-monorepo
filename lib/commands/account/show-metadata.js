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
class ShowMetadata extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.requireSynced = false;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ShowMetadata);
            const metadata = yield identity_1.IdentityMetadataWrapper.fromFile(this.kit, res.args.file);
            console.info(`Metadata at ${res.args.file} contains the following claims: \n`);
            yield identity_2.displayMetadata(metadata, this.kit);
        });
    }
}
exports.default = ShowMetadata;
ShowMetadata.description = 'Show the data in a local metadata file';
ShowMetadata.flags = Object.assign({}, base_1.BaseCommand.flags);
ShowMetadata.args = [command_1.Args.file('file', { description: 'Path of the metadata file' })];
ShowMetadata.examples = ['show-metadata ~/metadata.json'];
//# sourceMappingURL=show-metadata.js.map