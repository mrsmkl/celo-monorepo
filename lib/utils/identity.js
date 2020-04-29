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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const identity_1 = require("@celo/contractkit/lib/identity");
const claim_1 = require("@celo/contractkit/lib/identity/claims/claim");
const types_1 = require("@celo/contractkit/lib/identity/claims/types");
const verify_1 = require("@celo/contractkit/lib/identity/claims/verify");
const address_1 = require("@celo/utils/lib/address");
const async_1 = require("@celo/utils/lib/async");
const signatureUtils_1 = require("@celo/utils/lib/signatureUtils");
const cli_ux_1 = require("cli-ux");
const ethereumjs_util_1 = require("ethereumjs-util");
const fs_1 = require("fs");
const moment_1 = __importDefault(require("moment"));
const base_1 = require("../base");
const command_1 = require("./command");
class ClaimCommand extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.requireSynced = false;
        // We need this to properly parse flags for subclasses
        this.self = ClaimCommand;
        this.readMetadata = () => __awaiter(this, void 0, void 0, function* () {
            const { args, flags } = this.parse(this.self);
            const filePath = args.file;
            try {
                cli_ux_1.cli.action.start(`Read Metadata from ${filePath}`);
                const data = yield identity_1.IdentityMetadataWrapper.fromFile(this.kit, filePath);
                if (flags.from) {
                    yield this.checkMetadataAddress(data.data.meta.address, flags.from);
                }
                cli_ux_1.cli.action.stop();
                return data;
            }
            catch (error) {
                cli_ux_1.cli.action.stop(`Error: ${error}`);
                throw error;
            }
        });
        this.writeMetadata = (metadata) => {
            const { args } = this.parse(this.self);
            const filePath = args.file;
            try {
                cli_ux_1.cli.action.start(`Write Metadata to ${filePath}`);
                fs_1.writeFileSync(filePath, metadata.toString());
                cli_ux_1.cli.action.stop();
            }
            catch (error) {
                cli_ux_1.cli.action.stop(`Error: ${error}`);
                throw error;
            }
        };
    }
    checkMetadataAddress(address, from) {
        return __awaiter(this, void 0, void 0, function* () {
            if (address_1.eqAddress(address, from)) {
                return;
            }
            const accounts = yield this.kit.contracts.getAccounts();
            const signers = yield accounts.getCurrentSigners(address);
            if (!signers.some((a) => address_1.eqAddress(a, from))) {
                throw new Error('Signing metadata with an address that is not the account or one of its signers');
            }
        });
    }
    get signer() {
        const res = this.parse(this.self);
        const address = ethereumjs_util_1.toChecksumAddress(res.flags.from);
        return signatureUtils_1.NativeSigner(this.kit.web3.eth.sign, address);
    }
    addClaim(metadata, claim) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                cli_ux_1.cli.action.start(`Add claim`);
                const addedClaim = yield metadata.addClaim(claim, this.signer);
                cli_ux_1.cli.action.stop();
                return addedClaim;
            }
            catch (error) {
                cli_ux_1.cli.action.stop(`Error: ${error}`);
                throw error;
            }
        });
    }
}
exports.ClaimCommand = ClaimCommand;
ClaimCommand.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({
        required: true,
        description: 'Address of the account to set metadata for or an authorized signer for the address in the metadata',
    }) });
ClaimCommand.args = [command_1.Args.file('file', { description: 'Path of the metadata file' })];
exports.claimFlags = {
    from: command_1.Flags.address({
        required: true,
        description: 'Addess of the account to set metadata for',
    }),
};
exports.claimArgs = [command_1.Args.file('file', { description: 'Path of the metadata file' })];
exports.displayMetadata = (metadata, kit) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield async_1.concurrentMap(5, metadata.claims, (claim) => __awaiter(void 0, void 0, void 0, function* () {
        const verifiable = types_1.VERIFIABLE_CLAIM_TYPES.includes(claim.type);
        const validatable = types_1.VALIDATABLE_CLAIM_TYPES.includes(claim.type);
        const status = verifiable
            ? yield verify_1.verifyClaim(kit, claim, metadata.data.meta.address)
            : validatable
                ? yield claim_1.validateClaim(kit, claim, metadata.data.meta.address)
                : 'N/A';
        let extra = '';
        switch (claim.type) {
            case identity_1.ClaimTypes.ATTESTATION_SERVICE_URL:
                extra = `URL: ${claim.url}`;
                break;
            case identity_1.ClaimTypes.DOMAIN:
                extra = `Domain: ${claim.domain}`;
                break;
            case identity_1.ClaimTypes.KEYBASE:
                extra = `Username: ${claim.username}`;
                break;
            case identity_1.ClaimTypes.NAME:
                extra = `Name: "${claim.name}"`;
                break;
            default:
                extra = JSON.stringify(claim);
                break;
        }
        return {
            type: claim.type,
            extra,
            status: verifiable
                ? status
                    ? `Could not verify: ${status}`
                    : 'Verified!'
                : validatable
                    ? status
                        ? `Invalid: ${status}`
                        : `Valid!`
                    : 'N/A',
            createdAt: moment_1.default.unix(claim.timestamp).fromNow(),
        };
    }));
    cli_ux_1.cli.table(data, {
        type: { header: 'Type' },
        extra: { header: 'Value' },
        status: { header: 'Status' },
        createdAt: { header: 'Created At' },
    }, {});
});
exports.modifyMetadata = (kit, filePath, operation) => __awaiter(void 0, void 0, void 0, function* () {
    const metadata = yield identity_1.IdentityMetadataWrapper.fromFile(kit, filePath);
    yield operation(metadata);
    fs_1.writeFileSync(filePath, metadata.toString());
});
//# sourceMappingURL=identity.js.map