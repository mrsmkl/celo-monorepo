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
const command_1 = require("@oclif/command");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
const release_gold_1 = require("./release-gold");
class SetAccountWalletAddress extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(SetAccountWalletAddress);
            const isRevoked = yield this.releaseGoldWrapper.isRevoked();
            const checkBuilder = checks_1.newCheckBuilder(this)
                .isAccount(this.releaseGoldWrapper.address)
                .addCheck('Contract is not revoked', () => !isRevoked);
            let sig;
            if (flags.walletAddress !== '0x0000000000000000000000000000000000000000') {
                const accounts = yield this.kit.contracts.getAccounts();
                checkBuilder.addCheck('Wallet address is provided and PoP is provided', () => flags.pop !== undefined);
                yield checkBuilder.runChecks();
                const pop = String(flags.pop);
                sig = accounts.parseSignatureOfAddress(this.releaseGoldWrapper.address, flags.walletAddress, pop);
            }
            else {
                yield checkBuilder.runChecks();
                sig = {};
                sig.v = '0';
                sig.r = '0x0';
                sig.s = '0x0';
            }
            this.kit.defaultAccount = yield this.releaseGoldWrapper.getBeneficiary();
            yield cli_1.displaySendTx('setAccountWalletAddressTx', this.releaseGoldWrapper.setAccountWalletAddress(flags.walletAddress, sig.v, sig.r, sig.s));
        });
    }
}
exports.default = SetAccountWalletAddress;
SetAccountWalletAddress.description = "Set the ReleaseGold contract account's wallet address";
SetAccountWalletAddress.flags = Object.assign(Object.assign({}, release_gold_1.ReleaseGoldCommand.flags), { walletAddress: command_2.Flags.address({
        required: true,
        description: "Address of wallet to set for contract's account and signer of PoP. 0x0 if owner wants payers to contact them directly.",
    }), pop: command_1.flags.string({
        required: false,
        description: "ECDSA PoP for signer over contract's account",
    }) });
SetAccountWalletAddress.args = [];
SetAccountWalletAddress.examples = [
    'set-account-wallet-address --contract 0x5409ED021D9299bf6814279A6A1411A7e866A631 --walletAddress 0xE36Ea790bc9d7AB70C55260C66D52b1eca985f84 --pop 0x1b3e611d05e46753c43444cdc55c2cc3d95c54da0eba2464a8cc8cb01bd57ae8bb3d82a0e293ca97e5813e7fb9b624127f42ef0871d025d8a56fe2f8f08117e25b',
];
//# sourceMappingURL=set-account-wallet-address.js.map