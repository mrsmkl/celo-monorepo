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
const contractkit_1 = require("@celo/contractkit");
const identity_1 = require("@celo/contractkit/lib/identity");
const address_1 = require("@celo/utils/lib/address");
const cli_ux_1 = require("cli-ux");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const base_1 = require("../../base");
class AttestationServicesCurrent extends base_1.BaseCommand {
    getStatus(validator) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.kit.contracts.getAccounts();
            const hasAttestationSigner = yield accounts.hasAuthorizedAttestationSigner(validator.address);
            const metadataURL = yield accounts.getMetadataURL(validator.address);
            let attestationServiceURL;
            const ret = Object.assign(Object.assign({}, validator), { hasAttestationSigner, attestationServiceURL: 'N/A', okStatus: false, error: 'N/A', smsProviders: [], blacklistedRegionCodes: [], rightAccount: false });
            try {
                const metadata = yield contractkit_1.IdentityMetadataWrapper.fetchFromURL(this.kit, metadataURL);
                const attestationServiceURLClaim = metadata.findClaim(identity_1.ClaimTypes.ATTESTATION_SERVICE_URL);
                if (!attestationServiceURLClaim) {
                    return ret;
                }
                attestationServiceURL = attestationServiceURLClaim.url;
            }
            catch (error) {
                ret.error = error;
                return ret;
            }
            ret.attestationServiceURL = attestationServiceURL;
            const statusResponse = yield cross_fetch_1.default(attestationServiceURL + '/status');
            if (!statusResponse.ok) {
                return ret;
            }
            const statusResponseBody = yield statusResponse.json();
            ret.smsProviders = statusResponseBody.smsProviders;
            ret.blacklistedRegionCodes = statusResponseBody.blacklistedRegionCodes;
            ret.rightAccount = address_1.eqAddress(validator.address, statusResponseBody.accountAddress);
            return ret;
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(AttestationServicesCurrent);
            cli_ux_1.cli.action.start('Fetching currently elected Validators');
            const election = yield this.kit.contracts.getElection();
            const validators = yield this.kit.contracts.getValidators();
            const signers = yield election.getCurrentValidatorSigners();
            const validatorList = yield Promise.all(signers.map((addr) => validators.getValidatorFromSigner(addr)));
            const validatorInfo = yield Promise.all(validatorList.map(this.getStatus.bind(this)));
            cli_ux_1.cli.action.stop();
            cli_ux_1.cli.table(validatorInfo, {
                address: {},
                name: {},
                hasAttestationSigner: {},
                attestationServiceURL: {},
                okStatus: {},
                smsProviders: {},
                blacklistedRegionCodes: {},
                rightAccount: {},
            }, { 'no-truncate': !res.flags.truncate });
        });
    }
}
exports.default = AttestationServicesCurrent;
AttestationServicesCurrent.description = "Outputs the set of validators currently participating in BFT and which ones are participating in Celo's lightweight identity protocol";
AttestationServicesCurrent.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
//# sourceMappingURL=current-attestation-services.js.map