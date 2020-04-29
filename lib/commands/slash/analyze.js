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
const command_1 = require("@oclif/command");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const base_1 = require("../../base");
const command_2 = require("../../utils/command");
const epochIndex = {};
function findIndex(kit, address, block, epoch) {
    return __awaiter(this, void 0, void 0, function* () {
        if (epochIndex[epoch] !== undefined)
            return epochIndex[epoch];
        const election = yield kit._web3Contracts.getElection();
        const accounts = yield kit._web3Contracts.getAccounts();
        // @ts-ignore
        const signers = yield election.methods.getCurrentValidatorSigners().call({}, block);
        let acc = 0;
        for (const it of signers) {
            const addr = yield accounts.methods.signerToAccount(it).call();
            // console.log(it, '->', addr)
            if (addr === address) {
                epochIndex[epoch] = acc;
                return acc;
            }
            acc++;
        }
        return -1;
    });
}
function printBitmap(str) {
    while (str.length < 100)
        str = '0' + str;
    let res = '';
    for (let i = 0; i < 100; i++) {
        res += str.charAt(i) === '1' ? '.' : 'X';
    }
    return res;
}
class Analyze extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Analyze);
            const kit = this.kit;
            const block = res.flags.start;
            const slasher = yield kit._web3Contracts.getDowntimeSlasher();
            // const election = await kit._web3Contracts.getElection()
            const endBlock = res.flags.end;
            const startEpoch = parseInt(yield slasher.methods.getEpochNumberOfBlock(block).call(), 10);
            const endEpoch = parseInt(yield slasher.methods.getEpochNumberOfBlock(endBlock).call(), 10);
            console.log(`starting at block ${block} (epoch ${startEpoch}), ending at ${endBlock} (epoch ${endEpoch})`);
            const address = res.args.address;
            const startIndex = yield findIndex(kit, address, block, startEpoch);
            const endIndex = yield findIndex(kit, address, endBlock, endEpoch);
            console.log('start index', startIndex, 'end index', endIndex);
            let acc1 = 0;
            let acc2 = 0;
            for (let i = block; i < endBlock; i++) {
                const bitmap = new bignumber_js_1.default(
                // @ts-ignore
                yield slasher.methods.getParentSealBitmap(i + 1).call({}, endBlock + 10));
                const binary = bitmap.toString(2);
                const epoch = parseInt(yield slasher.methods.getEpochNumberOfBlock(i).call(), 10);
                const idx = yield findIndex(kit, address, i, epoch);
                const down = binary.charAt(binary.length - 1 - idx) === '0';
                acc1 += down ? 0 : 1;
                acc2 += down ? 1 : 0;
                console.log(epoch, i, printBitmap(binary), idx, down ? 'down' : 'up');
            }
            console.log('up', acc1, 'down', acc2);
        });
    }
}
exports.default = Analyze;
Analyze.description = 'Analyze downtime';
Analyze.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { start: command_1.flags.integer(Object.assign(Object.assign({}, command_2.Flags.block), { required: true })), end: command_1.flags.integer(Object.assign(Object.assign({}, command_2.Flags.block), { required: true })) });
Analyze.args = [command_2.Args.address('address')];
Analyze.examples = ['analyze 0x5409ed021d9299bf6814279a6a1411a7e866a631 --start 12300 --end 13300'];
//# sourceMappingURL=analyze.js.map