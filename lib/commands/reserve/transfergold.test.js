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
const ganache_test_1 = require("@celo/dev-utils/lib/ganache-test");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const transfergold_1 = __importDefault(require("./transfergold"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('reserve:transfergold cmd', (web3) => {
    const transferAmt = new bignumber_js_1.default(100000);
    const kit = contractkit_1.newKitFromWeb3(web3);
    let accounts = [];
    let goldToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        accounts = yield web3.eth.getAccounts();
        goldToken = yield kit.contracts.getGoldToken();
    }));
    test('transferGold fails if spender not passed in', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(transfergold_1.default.run([
            '--from',
            accounts[0],
            '--value',
            transferAmt.toString(10),
            '--to',
            accounts[9],
        ])).rejects.toThrow("Some checks didn't pass!");
    }));
    test('can transferGold with multisig option', () => __awaiter(void 0, void 0, void 0, function* () {
        const initialBalance = yield goldToken.balanceOf(accounts[9]);
        yield transfergold_1.default.run([
            '--from',
            accounts[0],
            '--value',
            transferAmt.toString(10),
            '--to',
            accounts[9],
            '--useMultiSig',
        ]);
        yield transfergold_1.default.run([
            '--from',
            accounts[7],
            '--value',
            transferAmt.toString(10),
            '--to',
            accounts[9],
            '--useMultiSig',
        ]);
        expect(yield goldToken.balanceOf(accounts[9])).toEqual(initialBalance.plus(transferAmt));
    }));
});
//# sourceMappingURL=transfergold.test.js.map