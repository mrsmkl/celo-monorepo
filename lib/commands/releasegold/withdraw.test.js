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
const create_account_1 = __importDefault(require("./create-account"));
const set_liquidity_provision_1 = __importDefault(require("./set-liquidity-provision"));
const withdraw_1 = __importDefault(require("./withdraw"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('releasegold:withdraw cmd', (web3) => {
    let contractAddress;
    let kit;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const contractCanValidate = true;
        contractAddress = yield ganache_test_1.getContractFromEvent('ReleaseGoldInstanceCreated(address,address)', web3, contractCanValidate);
        kit = contractkit_1.newKitFromWeb3(web3);
        yield create_account_1.default.run(['--contract', contractAddress]);
    }));
    test('can withdraw released gold to beneficiary', () => __awaiter(void 0, void 0, void 0, function* () {
        yield set_liquidity_provision_1.default.run(['--contract', contractAddress, '--yesreally']);
        // ReleasePeriod of default contract
        yield ganache_test_1.timeTravel(100000000, web3);
        const releaseGoldWrapper = new ReleaseGold_2.ReleaseGoldWrapper(kit, ReleaseGold_1.newReleaseGold(web3, contractAddress));
        const beneficiary = yield releaseGoldWrapper.getBeneficiary();
        const balanceBefore = yield kit.getTotalBalance(beneficiary);
        yield withdraw_1.default.run(['--contract', contractAddress, '--value', '10000000000000000000000']);
        const balanceAfter = yield kit.getTotalBalance(beneficiary);
        yield expect(balanceBefore.gold.toNumber()).toBeLessThan(balanceAfter.gold.toNumber());
    }));
});
//# sourceMappingURL=withdraw.test.js.map