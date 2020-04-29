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
const command_1 = require("@oclif/command");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const command_2 = require("../../utils/command");
class TestAttestationService extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.requireSynced = false;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { flags } = this.parse(TestAttestationService);
            const address = flags.from;
            const { phoneNumber, message } = flags;
            yield checks_1.newCheckBuilder(this, flags.from)
                .isSignerOrAccount()
                .canSign(address)
                .runChecks();
            const accounts = yield this.kit.contracts.getAccounts();
            const account = yield accounts.signerToAccount(address);
            const hasAuthorizedAttestationSigner = yield accounts.hasAuthorizedAttestationSigner(account);
            if (!hasAuthorizedAttestationSigner) {
                console.info('Account has not authorized an attestation signer');
                return;
            }
            const metadataURL = yield accounts.getMetadataURL(account);
            if (!metadataURL) {
                console.info('No metadata set for address');
                return;
            }
            let metadata;
            try {
                metadata = yield identity_1.IdentityMetadataWrapper.fetchFromURL(this.kit, metadataURL);
            }
            catch (error) {
                console.error(`Metadata could not be retrieved from ${metadataURL}: ${error.toString()}`);
                return;
            }
            const attestationServiceUrlClaim = metadata.findClaim(identity_1.ClaimTypes.ATTESTATION_SERVICE_URL);
            if (!attestationServiceUrlClaim) {
                console.error('No attestation service claim could be found');
                return;
            }
            const signature = yield this.kit.web3.eth.sign(phoneNumber + message, address);
            try {
                const response = yield cross_fetch_1.default(attestationServiceUrlClaim.url + '/test_attestations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber, signature, message }),
                });
                if (!response.ok) {
                    console.error('Request was not successful');
                    console.error(`Status: ${response.status}`);
                    console.error(`Response: ${yield response.text()}`);
                }
                console.info('Request successful');
            }
            catch (error) {
                console.error(`Something went wrong`);
                console.error(error);
            }
        });
    }
}
exports.default = TestAttestationService;
TestAttestationService.description = 'Tests whether the account has setup the attestation service properly by calling the test endpoint on it';
TestAttestationService.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({
        required: true,
        description: "Your validator's signer or account address",
    }), phoneNumber: command_2.Flags.phoneNumber({
        required: true,
        description: 'The phone number to send the test message to',
    }), message: command_1.flags.string({ required: true, description: 'The message of the SMS' }) });
TestAttestationService.examples = ['test-attestation-service --from 0x97f7333c51897469E8D98E7af8653aAb468050a3'];
//# sourceMappingURL=test-attestation-service.js.map