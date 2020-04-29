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
const ReleaseGold_1 = require("@celo/contractkit/lib/generated/ReleaseGold");
const ReleaseGold_2 = require("@celo/contractkit/lib/wrappers/ReleaseGold");
const ganache_test_1 = require("@celo/dev-utils/lib/ganache-test");
const refund_and_finalize_1 = __importDefault(require("./refund-and-finalize"));
const revoke_1 = __importDefault(require("./revoke"));
const show_1 = __importDefault(require("./show"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('releasegold:refund-and-finalize cmd', (web3) => {
    let contractAddress;
    let kit;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const contractCanValidate = false;
        contractAddress = yield ganache_test_1.getContractFromEvent('ReleaseGoldInstanceCreated(address,address)', web3, contractCanValidate);
        kit = contractkit_1.newKitFromWeb3(web3);
    }));
    test('can refund gold', () => __awaiter(void 0, void 0, void 0, function* () {
        yield revoke_1.default.run(['--contract', contractAddress, '--yesreally']);
        const releaseGoldWrapper = new ReleaseGold_2.ReleaseGoldWrapper(kit, ReleaseGold_1.newReleaseGold(web3, contractAddress));
        const refundAddress = yield releaseGoldWrapper.getRefundAddress();
        const balanceBefore = yield kit.getTotalBalance(refundAddress);
        yield refund_and_finalize_1.default.run(['--contract', contractAddress]);
        const balanceAfter = yield kit.getTotalBalance(refundAddress);
        expect(balanceBefore.gold.toNumber()).toBeLessThan(balanceAfter.gold.toNumber());
    }));
    test('can finalize the contract', () => __awaiter(void 0, void 0, void 0, function* () {
        yield revoke_1.default.run(['--contract', contractAddress, '--yesreally']);
        yield refund_and_finalize_1.default.run(['--contract', contractAddress]);
        yield expect(show_1.default.run(['--contract', contractAddress])).rejects.toThrow();
    }));
});
//# sourceMappingURL=refund-and-finalize.test.js.map