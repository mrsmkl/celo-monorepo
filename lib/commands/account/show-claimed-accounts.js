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
const verify_1 = require("@celo/contractkit/lib/identity/claims/verify");
const address_1 = require("@celo/utils/lib/address");
const collections_1 = require("@celo/utils/lib/collections");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
function getMetadata(kit, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const accounts = yield kit.contracts.getAccounts();
        const url = yield accounts.getMetadataURL(address);
        console.log(address, 'has url', url);
        if (url === '')
            return identity_1.IdentityMetadataWrapper.fromEmpty(address);
        else
            return identity_1.IdentityMetadataWrapper.fetchFromURL(kit, url);
    });
}
function dedup(lst) {
    return [...new Set(lst)];
}
function getClaims(kit, address, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const getClaim = (claim) => __awaiter(this, void 0, void 0, function* () {
            const error = yield verify_1.verifyAccountClaim(kit, claim, address_1.ensureLeading0x(address));
            return error ? null : claim.address.toLowerCase();
        });
        const res = (yield Promise.all(data.filterClaims(identity_1.ClaimTypes.ACCOUNT).map(getClaim))).filter(collections_1.notEmpty);
        res.push(address);
        return dedup(res);
    });
}
class ShowClaimedAccounts extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args } = this.parse(ShowClaimedAccounts);
            const metadata = yield getMetadata(this.kit, args.address);
            const claimedAccounts = yield getClaims(this.kit, args.address, metadata);
            console.log('All balances expressed in units of 10^-18.');
            let sum = new bignumber_js_1.default(0);
            for (const address of claimedAccounts) {
                console.log('\nShowing balances for', address);
                const balance = yield this.kit.getTotalBalance(address);
                sum = sum.plus(balance.total);
                cli_1.printValueMap(balance);
            }
            console.log('\nSum of total balances:', sum.toString(10));
        });
    }
}
exports.default = ShowClaimedAccounts;
ShowClaimedAccounts.description = 'Show information about claimed accounts';
ShowClaimedAccounts.flags = Object.assign({}, base_1.BaseCommand.flags);
ShowClaimedAccounts.args = [command_1.Args.address('address')];
ShowClaimedAccounts.examples = ['show-claimed-accounts 0x5409ed021d9299bf6814279a6a1411a7e866a631'];
//# sourceMappingURL=show-claimed-accounts.js.map