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
const lock_1 = __importDefault(require("./lock"));
const unlock_1 = __importDefault(require("./unlock"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('lockedgold:lock cmd', (web3) => {
    test('can lock with pending withdrawals', () => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield web3.eth.getAccounts();
        const account = accounts[0];
        const kit = contractkit_1.newKitFromWeb3(web3);
        const lockedGold = yield kit.contracts.getLockedGold();
        yield register_1.default.run(['--from', account]);
        yield lock_1.default.run(['--from', account, '--value', '100']);
        yield unlock_1.default.run(['--from', account, '--value', '50']);
        yield lock_1.default.run(['--from', account, '--value', '75']);
        yield unlock_1.default.run(['--from', account, '--value', '50']);
        yield lock_1.default.run(['--from', account, '--value', '50']);
        const pendingWithdrawalsTotalValue = yield lockedGold.getPendingWithdrawalsTotalValue(account);
        expect(pendingWithdrawalsTotalValue.toFixed()).toBe('0');
    }));
});
//# sourceMappingURL=lock.test.js.map