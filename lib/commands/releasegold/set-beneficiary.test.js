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
const set_beneficiary_1 = __importDefault(require("./set-beneficiary"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('releasegold:set-beneficiary cmd', (web3) => {
    let contractAddress;
    let kit;
    let releaseGoldWrapper;
    let releaseGoldMultiSig;
    let releaseOwner;
    let beneficiary;
    let newBeneficiary;
    let otherAccount;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield web3.eth.getAccounts();
        releaseOwner = accounts[0];
        newBeneficiary = accounts[2];
        otherAccount = accounts[3];
        const contractCanValidate = false;
        contractAddress = yield ganache_test_1.getContractFromEvent('ReleaseGoldInstanceCreated(address,address)', web3, contractCanValidate);
        releaseGoldWrapper = new ReleaseGold_2.ReleaseGoldWrapper(kit, ReleaseGold_1.newReleaseGold(web3, contractAddress));
        beneficiary = yield releaseGoldWrapper.getBeneficiary();
        kit = contractkit_1.newKitFromWeb3(web3);
        const owner = yield releaseGoldWrapper.getOwner();
        releaseGoldMultiSig = yield kit.contracts.getMultiSig(owner);
    }));
    test('can change beneficiary', () => __awaiter(void 0, void 0, void 0, function* () {
        // First submit the tx from the release owner (accounts[0])
        yield set_beneficiary_1.default.run([
            '--contract',
            contractAddress,
            '--from',
            releaseOwner,
            '--beneficiary',
            newBeneficiary,
            '--yesreally',
        ]);
        // The multisig tx should not confirm until both parties submit
        expect(yield releaseGoldWrapper.getBeneficiary()).toEqual(beneficiary);
        yield set_beneficiary_1.default.run([
            '--contract',
            contractAddress,
            '--from',
            beneficiary,
            '--beneficiary',
            newBeneficiary,
            '--yesreally',
        ]);
        expect(yield releaseGoldWrapper.getBeneficiary()).toEqual(newBeneficiary);
        // It should also update the multisig owners
        expect(yield releaseGoldMultiSig.getOwners()).toEqual([releaseOwner, newBeneficiary]);
    }));
    test('if called by a different account, it should fail', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(set_beneficiary_1.default.run([
            '--contract',
            contractAddress,
            '--from',
            otherAccount,
            '--beneficiary',
            newBeneficiary,
            '--yesreally',
        ])).rejects.toThrow();
    }));
    test('if the owners submit different txs, nothing on the ReleaseGold contract should change', () => __awaiter(void 0, void 0, void 0, function* () {
        // ReleaseOwner tries to change the beneficiary to `newBeneficiary` while the beneficiary
        // tries to change to `otherAccount`. Nothing should change on the RG contract.
        yield set_beneficiary_1.default.run([
            '--contract',
            contractAddress,
            '--from',
            releaseOwner,
            '--beneficiary',
            newBeneficiary,
            '--yesreally',
        ]);
        yield set_beneficiary_1.default.run([
            '--contract',
            contractAddress,
            '--from',
            beneficiary,
            '--beneficiary',
            otherAccount,
            '--yesreally',
        ]);
        expect(yield releaseGoldWrapper.getBeneficiary()).toEqual(beneficiary);
        expect(yield releaseGoldMultiSig.getOwners()).toEqual([releaseOwner, beneficiary]);
    }));
});
//# sourceMappingURL=set-beneficiary.test.js.map