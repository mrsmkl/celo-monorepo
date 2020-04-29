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
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class TransferGold extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(TransferGold);
            const value = res.flags.value;
            const to = res.flags.to;
            const account = res.flags.from;
            const useMultiSig = res.flags.useMultiSig;
            this.kit.defaultAccount = account;
            const reserve = yield this.kit.contracts.getReserve();
            const spenders = useMultiSig ? yield reserve.getSpenders() : [];
            // assumes that the multisig is the most recent spender in the spenders array
            const multiSigAddress = spenders.length > 0 ? spenders[spenders.length - 1] : '';
            const reserveSpenderMultiSig = useMultiSig
                ? yield this.kit.contracts.getMultiSig(multiSigAddress)
                : undefined;
            const spender = useMultiSig ? multiSigAddress : account;
            yield checks_1.newCheckBuilder(this)
                .addCheck(`${spender} is a reserve spender`, () => __awaiter(this, void 0, void 0, function* () { return reserve.isSpender(spender); }))
                .addConditionalCheck(`${account} is a multisig signatory`, useMultiSig, () => __awaiter(this, void 0, void 0, function* () {
                return reserveSpenderMultiSig !== undefined
                    ? reserveSpenderMultiSig.isowner(account)
                    : new Promise(() => false);
            }))
                .addCheck(`${to} is another reserve address`, () => __awaiter(this, void 0, void 0, function* () { return reserve.isOtherReserveAddress(to); }))
                .runChecks();
            const reserveTx = yield reserve.transferGold(to, value);
            const tx = reserveSpenderMultiSig === undefined
                ? reserveTx
                : yield reserveSpenderMultiSig.submitOrConfirmTransaction(reserve.address, reserveTx.txo);
            yield cli_1.displaySendTx('transferGoldTx', tx);
        });
    }
}
exports.default = TransferGold;
TransferGold.description = 'Transfers reserve gold to other reserve address';
TransferGold.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { value: command_1.flags.string({ required: true, description: 'The unit amount of Celo Gold (cGLD)' }), to: command_2.Flags.address({ required: true, description: 'Receiving address' }), from: command_2.Flags.address({ required: true, description: "Spender's address" }), useMultiSig: command_1.flags.boolean({
        description: 'True means the request will be sent through multisig.',
    }) });
TransferGold.examples = [
    'transfergold --value 9000 --to 0x91c987bf62D25945dB517BDAa840A6c661374402 --from 0x5409ed021d9299bf6814279a6a1411a7e866a631',
    'transfergold --value 9000 --to 0x91c987bf62D25945dB517BDAa840A6c661374402 --from 0x5409ed021d9299bf6814279a6a1411a7e866a631 --useMultiSig',
];
//# sourceMappingURL=transfergold.js.map