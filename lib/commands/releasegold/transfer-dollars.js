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
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
const release_gold_1 = require("./release-gold");
class TransferDollars extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(TransferDollars);
            const isRevoked = yield this.releaseGoldWrapper.isRevoked();
            this.kit.defaultAccount = isRevoked
                ? yield this.releaseGoldWrapper.getReleaseOwner()
                : yield this.releaseGoldWrapper.getBeneficiary();
            yield cli_1.displaySendTx('transfer', this.releaseGoldWrapper.transfer(flags.to, flags.value));
        });
    }
}
exports.default = TransferDollars;
TransferDollars.description = 'Transfer Celo Dollars from the given contract address. Dollars may be accrued to the ReleaseGold contract via validator epoch rewards.';
TransferDollars.flags = Object.assign(Object.assign({}, release_gold_1.ReleaseGoldCommand.flags), { to: command_1.Flags.address({
        required: true,
        description: 'Address of the recipient of Celo Dollars transfer',
    }), value: command_1.Flags.wei({ required: true, description: 'Value (in Wei) of Celo Dollars to transfer' }) });
TransferDollars.args = [];
TransferDollars.examples = [
    'transfer-dollars --contract 0x5409ED021D9299bf6814279A6A1411A7e866A631 --to 0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb --value 10000000000000000000000',
];
//# sourceMappingURL=transfer-dollars.js.map