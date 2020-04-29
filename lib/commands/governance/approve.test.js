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
const governance_1 = require("@celo/contractkit/lib/governance");
const Governance_1 = require("@celo/contractkit/lib/wrappers/Governance");
const ganache_test_1 = require("@celo/dev-utils/lib/ganache-test");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const approve_1 = __importDefault(require("./approve"));
process.env.NO_SYNCCHECK = 'true';
const expConfig = ganache_test_1.NetworkConfig.governance;
ganache_test_1.testWithGanache('governance:approve cmd', (web3) => {
    const minDeposit = web3.utils.toWei(expConfig.minDeposit.toString(), 'ether');
    const kit = contractkit_1.newKitFromWeb3(web3);
    const proposalID = new bignumber_js_1.default(1);
    let accounts = [];
    let governance;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        accounts = yield web3.eth.getAccounts();
        kit.defaultAccount = accounts[0];
        governance = yield kit.contracts.getGovernance();
        let proposal;
        proposal = yield new governance_1.ProposalBuilder(kit).build();
        yield governance
            .propose(proposal, 'URL')
            .sendAndWaitForReceipt({ from: accounts[0], value: minDeposit });
        yield ganache_test_1.timeTravel(expConfig.dequeueFrequency, web3);
        yield governance.dequeueProposalsIfReady().sendAndWaitForReceipt();
    }));
    test('approve fails if approver not passed in', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(approve_1.default.run(['--from', accounts[0], '--proposalID', proposalID.toString(10)])).rejects.toThrow("Some checks didn't pass!");
    }));
    test('can approve with multisig option', () => __awaiter(void 0, void 0, void 0, function* () {
        yield approve_1.default.run([
            '--from',
            accounts[0],
            '--proposalID',
            proposalID.toString(10),
            '--useMultiSig',
        ]);
        expect(yield governance.getProposalStage(proposalID)).toEqual(Governance_1.ProposalStage.Approval);
        expect(yield governance.isApproved(proposalID)).toBeTruthy();
    }));
});
//# sourceMappingURL=approve.test.js.map