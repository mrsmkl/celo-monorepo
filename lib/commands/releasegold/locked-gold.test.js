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
const create_account_1 = __importDefault(require("./create-account"));
const locked_gold_1 = __importDefault(require("./locked-gold"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('releasegold:locked-gold cmd', (web3) => {
    let contractAddress;
    let kit;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const contractCanValdiate = true;
        contractAddress = yield ganache_test_1.getContractFromEvent('ReleaseGoldInstanceCreated(address,address)', web3, contractCanValdiate);
        kit = contractkit_1.newKitFromWeb3(web3);
        yield create_account_1.default.run(['--contract', contractAddress]);
    }));
    test('can lock gold with pending withdrawals', () => __awaiter(void 0, void 0, void 0, function* () {
        const lockedGold = yield kit.contracts.getLockedGold();
        yield locked_gold_1.default.run(['--contract', contractAddress, '--action', 'lock', '--value', '100']);
        yield locked_gold_1.default.run(['--contract', contractAddress, '--action', 'unlock', '--value', '50']);
        yield locked_gold_1.default.run(['--contract', contractAddress, '--action', 'lock', '--value', '75']);
        yield locked_gold_1.default.run(['--contract', contractAddress, '--action', 'unlock', '--value', '50']);
        const pendingWithdrawalsTotalValue = yield lockedGold.getPendingWithdrawalsTotalValue(contractAddress);
        yield expect(pendingWithdrawalsTotalValue.toFixed()).toBe('50');
    }));
});
//# sourceMappingURL=locked-gold.test.js.map