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
const block_explorer_1 = require("@celo/contractkit/lib/explorer/block-explorer");
const command_1 = require("@oclif/command");
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class ShowMultiSig extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args, flags: { tx, all, raw }, } = this.parse(ShowMultiSig);
            const multisig = yield this.kit.contracts.getMultiSig(args.address);
            const txs = yield multisig.getTransactionCount();
            const explorer = yield block_explorer_1.newBlockExplorer(this.kit);
            const process = (txdata) => __awaiter(this, void 0, void 0, function* () {
                if (raw)
                    return txdata;
                return Object.assign(Object.assign({}, txdata), { data: explorer.tryParseTxInput(txdata.destination, txdata.data) });
            });
            const txinfo = tx !== undefined
                ? yield process(yield multisig.getTransaction(tx))
                : all
                    ? yield Promise.all((yield multisig.getTransactions()).map(process))
                    : txs;
            const info = {
                Owners: yield multisig.getOwners(),
                'Required confirmations': yield multisig.getRequired(),
                'Required confirmations (internal)': yield multisig.getInternalRequired(),
                Transactions: txinfo,
            };
            cli_1.printValueMapRecursive(info);
        });
    }
}
exports.default = ShowMultiSig;
ShowMultiSig.description = 'Shows information about multi-sig contract';
ShowMultiSig.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses()), { tx: command_1.flags.integer({
        default: undefined,
        description: 'Show info for a transaction',
    }), all: command_1.flags.boolean({ default: false, description: 'Show info about all transactions' }), raw: command_1.flags.boolean({ default: false, description: 'Do not attempt to parse transactions' }) });
ShowMultiSig.args = [command_2.Args.address('address')];
ShowMultiSig.examples = [
    'show 0x5409ed021d9299bf6814279a6a1411a7e866a631',
    'show 0x5409ed021d9299bf6814279a6a1411a7e866a631 --tx 3',
    'show 0x5409ed021d9299bf6814279a6a1411a7e866a631 --all --raw',
];
//# sourceMappingURL=show.js.map