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
const keybase_1 = require("@celo/contractkit/lib/identity/claims/keybase");
const async_1 = require("@celo/utils/lib/async");
const command_1 = require("@oclif/command");
const cli_ux_1 = require("cli-ux");
const ethereumjs_util_1 = require("ethereumjs-util");
const fs_1 = require("fs");
const os_1 = require("os");
const cli_1 = require("../../utils/cli");
const exec_1 = require("../../utils/exec");
const identity_1 = require("../../utils/identity");
class ClaimKeybase extends identity_1.ClaimCommand {
    constructor() {
        super(...arguments);
        this.self = ClaimKeybase;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ClaimKeybase);
            const username = res.flags.username;
            const metadata = yield this.readMetadata();
            const accountAddress = ethereumjs_util_1.toChecksumAddress(metadata.data.meta.address);
            const claim = keybase_1.createKeybaseClaim(username);
            const signature = yield this.signer.sign(claim_1.hashOfClaim(claim));
            yield this.addClaim(metadata, claim);
            this.writeMetadata(metadata);
            try {
                yield this.uploadProof(claim, signature, username, accountAddress);
            }
            catch (error) {
                this.printManualInstruction(claim, signature, username, accountAddress);
            }
        });
    }
    attemptAutomaticProofUpload(claim, signature, username, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const signedClaim = { claim, signature };
            try {
                cli_ux_1.cli.action.start(`Attempting to automate keybase proof`);
                const publicFolderPrefix = `/keybase/public/${username}/`;
                yield this.ensureKeybaseFilePathToProof(publicFolderPrefix);
                const fileName = keybase_1.proofFileName(address);
                const tmpPath = `${os_1.tmpdir()}/${fileName}`;
                fs_1.writeFileSync(tmpPath, JSON.stringify(signedClaim));
                console.log('here');
                yield exec_1.execCmdWithError('keybase', ['fs', 'cp', tmpPath, publicFolderPrefix + keybase_1.keybaseFilePathToProof + '/' + fileName], { silent: false });
                cli_ux_1.cli.action.stop();
                cli_ux_1.cli.action.start(`Claim successfully copied to the keybase file system, verifying proof`);
                // Wait for changes to propagate
                yield async_1.sleep(3000);
                const verificationError = yield keybase_1.verifyKeybaseClaim(this.kit, claim, address);
                if (verificationError) {
                    throw new Error(`Claim is not verifiable: ${verificationError}`);
                }
                cli_ux_1.cli.action.stop();
                console.info('Claim is verifiable!');
            }
            catch (error) {
                cli_ux_1.cli.action.stop(`Error: ${error}`);
                throw error;
            }
        });
    }
    uploadProof(claim, signature, username, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('here');
                if ((yield exec_1.commandExists('keybase')) &&
                    (yield cli_1.binaryPrompt(`Found keybase CLI. Do you want me to attempt to publish the claim onto the keybase fs?`))) {
                    yield this.attemptAutomaticProofUpload(claim, signature, username, address);
                }
                else {
                    this.printManualInstruction(claim, signature, username, address);
                }
            }
            catch (error) {
                cli_ux_1.cli.action.stop('Error');
                console.error('Could not automatically finish the proving, please complete this step manually.\n\n ' +
                    error);
                this.printManualInstruction(claim, signature, username, address);
            }
        });
    }
    printManualInstruction(claim, signature, username, address) {
        const fileName = keybase_1.proofFileName(address);
        fs_1.writeFileSync(fileName, JSON.stringify({ claim, signature }));
        console.info(`\nProving a keybase claim requires you to publish the signed claim on your Keybase file system to prove ownership. We saved it for you under ${fileName}. It should be hosted in your public folder at ${keybase_1.keybaseFilePathToProof}/${fileName}, so that it is available under ${keybase_1.targetURL(username, address)}\n`);
    }
    ensureKeybaseFilePathToProof(base) {
        return __awaiter(this, void 0, void 0, function* () {
            const segments = keybase_1.keybaseFilePathToProof.split('/');
            let currentPath = base;
            for (let i = 0; i < segments.length - 1; i++) {
                currentPath += segments[i] + '/';
                if (!(yield exec_1.execWith0Exit('keybase', ['fs', 'ls', currentPath], { silent: true }))) {
                    yield exec_1.execCmdWithError('keybase', ['fs', 'mkdir', currentPath], { silent: true });
                }
            }
        });
    }
}
exports.default = ClaimKeybase;
ClaimKeybase.description = 'Claim a keybase username and add the claim to a local metadata file';
ClaimKeybase.flags = Object.assign(Object.assign({}, identity_1.ClaimCommand.flags), { username: command_1.flags.string({
        required: true,
        description: 'The keybase username you want to claim',
    }) });
ClaimKeybase.args = identity_1.ClaimCommand.args;
ClaimKeybase.examples = [
    'claim-keybase ~/metadata.json --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --username myusername',
];
//# sourceMappingURL=claim-keybase.js.map