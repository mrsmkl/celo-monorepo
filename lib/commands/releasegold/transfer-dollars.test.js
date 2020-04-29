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
const register_1 = __importDefault(require("../account/register"));
const dollars_1 = __importDefault(require("../transfer/dollars"));
const create_account_1 = __importDefault(require("./create-account"));
const transfer_dollars_1 = __importDefault(require("./transfer-dollars"));
process.env.NO_SYNCCHECK = 'true';
// Lots of commands, sometimes times out
jest.setTimeout(15000);
ganache_test_1.testWithGanache('releasegold:transfer-dollars cmd', (web3) => {
    let accounts = [];
    let contractAddress;
    let kit;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const contractCanValidate = false;
        contractAddress = yield ganache_test_1.getContractFromEvent('ReleaseGoldInstanceCreated(address,address)', web3, contractCanValidate);
        kit = contractkit_1.newKitFromWeb3(web3);
        accounts = yield web3.eth.getAccounts();
        yield register_1.default.run(['--from', accounts[0]]);
        yield create_account_1.default.run(['--contract', contractAddress]);
    }));
    test('can transfer dollars out of the ReleaseGold contract', () => __awaiter(void 0, void 0, void 0, function* () {
        const balanceBefore = yield kit.getTotalBalance(accounts[0]);
        const cUSDToTransfer = '500000000000000000000';
        // Send cUSD to RG contract
        yield dollars_1.default.run([
            '--from',
            accounts[0],
            '--to',
            contractAddress,
            '--value',
            cUSDToTransfer,
        ]);
        // RG cUSD balance should match the amount sent
        const contractBalance = yield kit.getTotalBalance(contractAddress);
        expect(contractBalance.usd.toFixed()).toEqual(cUSDToTransfer);
        // Attempt to send cUSD back
        yield transfer_dollars_1.default.run([
            '--contract',
            contractAddress,
            '--to',
            accounts[0],
            '--value',
            cUSDToTransfer,
        ]);
        const balanceAfter = yield kit.getTotalBalance(accounts[0]);
        expect(balanceBefore.usd).toEqual(balanceAfter.usd);
    }));
    test('should fail if contract has no celo dollars', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(transfer_dollars_1.default.run(['--contract', contractAddress, '--to', accounts[0], '--value', '1'])).rejects.toThrow();
    }));
});
//# sourceMappingURL=transfer-dollars.test.js.map