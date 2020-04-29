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
const address_1 = require("@celo/utils/lib/address");
const signatureUtils_1 = require("@celo/utils/lib/signatureUtils");
const chalk_1 = __importDefault(require("chalk"));
const cli_1 = require("./cli");
function check(name, predicate, errorMessage) {
    return {
        name,
        errorMessage,
        run: predicate,
    };
}
exports.check = check;
const negate = (x) => x.then((y) => !y);
function newCheckBuilder(cmd, signer) {
    return new CheckBuilder(cmd, signer);
}
exports.newCheckBuilder = newCheckBuilder;
class CheckBuilder {
    constructor(cmd, signer) {
        this.cmd = cmd;
        this.signer = signer;
        this.checks = [];
        this.isApprover = (account) => this.addCheck(`${account} is approver address`, this.withGovernance((g) => __awaiter(this, void 0, void 0, function* () { return address_1.eqAddress(yield g.getApprover(), account); })));
        this.proposalExists = (proposalID) => this.addCheck(`${proposalID} is an existing proposal`, this.withGovernance((g) => g.proposalExists(proposalID)));
        this.proposalInStage = (proposalID, stage) => this.addCheck(`${proposalID} is in stage ${stage}`, this.withGovernance((g) => __awaiter(this, void 0, void 0, function* () {
            const match = (yield g.getProposalStage(proposalID)) === stage;
            if (!match) {
                const timeUntilStages = yield g.timeUntilStages(proposalID);
                cli_1.printValueMapRecursive({ timeUntilStages });
            }
            return match;
        })));
        this.proposalIsPassing = (proposalID) => this.addCheck(`Proposal ${proposalID} is passing corresponding constitutional quorum`, this.withGovernance((g) => g.isProposalPassing(proposalID)));
        this.hotfixIsPassing = (hash) => this.addCheck(`Hotfix 0x${hash.toString('hex')} is whitelisted by quorum of validators`, this.withGovernance((g) => g.isHotfixPassing(hash)));
        this.hotfixNotExecuted = (hash) => this.addCheck(`Hotfix 0x${hash.toString('hex')} is not already executed`, this.withGovernance((g) => __awaiter(this, void 0, void 0, function* () { return !(yield g.getHotfixRecord(hash)).executed; })));
        this.canSign = (account) => this.addCheck('Account can sign', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const message = 'test';
                const signature = yield this.kit.web3.eth.sign(message, account);
                return signatureUtils_1.verifySignature(message, signature, account);
            }
            catch (error) {
                console.error(error);
                return false;
            }
        }));
        this.canSignValidatorTxs = () => this.addCheck('Signer can sign Validator Txs', this.withAccounts((lg) => lg
            .validatorSignerToAccount(this.signer)
            .then(() => true)
            .catch(() => false)));
        this.signerAccountIsValidator = () => this.addCheck(`Signer account is Validator`, this.withValidators((v, _s, account) => v.isValidator(account)));
        this.signerAccountIsValidatorGroup = () => this.addCheck(`Signer account is ValidatorGroup`, this.withValidators((v, _s, account) => v.isValidatorGroup(account)));
        this.isValidator = (account) => this.addCheck(`${account} is Validator`, this.withValidators((v) => v.isValidator(account)));
        this.isValidatorGroup = (account) => this.addCheck(`${account} is ValidatorGroup`, this.withValidators((v) => v.isValidatorGroup(account)));
        this.isNotValidator = () => this.addCheck(`${this.signer} is not a registered Validator`, this.withValidators((v, _signer, account) => negate(v.isValidator(account))));
        this.isNotValidatorGroup = () => this.addCheck(`${this.signer} is not a registered ValidatorGroup`, this.withValidators((v, _signer, account) => negate(v.isValidatorGroup(account))));
        this.signerMeetsValidatorBalanceRequirements = () => this.addCheck(`Signer's account has enough locked gold for registration`, this.withValidators((v, _signer, account) => v.meetsValidatorBalanceRequirements(account)));
        this.signerMeetsValidatorGroupBalanceRequirements = () => this.addCheck(`Signer's account has enough locked gold for group registration`, this.withValidators((v, _signer, account) => v.meetsValidatorGroupBalanceRequirements(account)));
        this.meetsValidatorBalanceRequirements = (account) => this.addCheck(`${account} has enough locked gold for registration`, this.withValidators((v) => v.meetsValidatorBalanceRequirements(account)));
        this.meetsValidatorGroupBalanceRequirements = (account) => this.addCheck(`${account} has enough locked gold for group registration`, this.withValidators((v) => v.meetsValidatorGroupBalanceRequirements(account)));
        this.isNotAccount = (address) => this.addCheck(`${address} is not a registered Account`, this.withAccounts((accs) => negate(accs.isAccount(address))));
        this.isSignerOrAccount = () => this.addCheck(`${this.signer} is Signer or registered Account`, this.withAccounts((accs) => __awaiter(this, void 0, void 0, function* () {
            const res = (yield accs.isAccount(this.signer)) || (yield accs.isSigner(this.signer));
            return res;
        })));
        this.isVoteSignerOrAccount = () => this.addCheck(`${this.signer} is vote signer or registered account`, this.withAccounts((accs) => __awaiter(this, void 0, void 0, function* () {
            return accs.voteSignerToAccount(this.signer).then((addr) => !address_1.eqAddress(addr, address_1.NULL_ADDRESS), () => false);
        })));
        this.isAccount = (address) => this.addCheck(`${address} is a registered Account`, this.withAccounts((accs) => accs.isAccount(address)), `${address} is not registered as an account. Try running account:register`);
        this.isNotVoting = (address) => this.addCheck(`${address} is not currently voting on a governance proposal`, this.withGovernance((gov) => negate(gov.isVoting(address))), `${address} is currently voting in governance. Revoke your upvotes or wait for the referendum to end.`);
        this.hasEnoughGold = (account, value) => {
            const valueInEth = this.kit.web3.utils.fromWei(value.toFixed(), 'ether');
            return this.addCheck(`Account has at least ${valueInEth} cGLD`, () => this.kit.contracts
                .getGoldToken()
                .then((gt) => gt.balanceOf(account))
                .then((balance) => balance.gte(value)));
        };
        this.exceedsProposalMinDeposit = (deposit) => this.addCheck(`Deposit is greater than or equal to governance proposal minDeposit`, this.withGovernance((g) => __awaiter(this, void 0, void 0, function* () { return deposit.gte(yield g.minDeposit()); })));
        this.hasEnoughLockedGold = (value) => {
            const valueInEth = this.kit.web3.utils.fromWei(value.toFixed(), 'ether');
            return this.addCheck(`Account has at least ${valueInEth} Locked Gold`, this.withLockedGold((l, _signer, account) => __awaiter(this, void 0, void 0, function* () { return value.isLessThanOrEqualTo(yield l.getAccountTotalLockedGold(account)); })));
        };
        this.hasEnoughNonvotingLockedGold = (value) => {
            const valueInEth = this.kit.web3.utils.fromWei(value.toFixed(), 'ether');
            return this.addCheck(`Account has at least ${valueInEth} non-voting Locked Gold`, this.withLockedGold((l, _signer, account) => __awaiter(this, void 0, void 0, function* () { return value.isLessThanOrEqualTo(yield l.getAccountNonvotingLockedGold(account)); })));
        };
        this.hasEnoughLockedGoldToUnlock = (value) => {
            const valueInEth = this.kit.web3.utils.fromWei(value.toFixed(), 'ether');
            return this.addCheck(`Account has at least ${valueInEth} non-voting Locked Gold over requirement`, this.withLockedGold((l, _signer, account, v) => __awaiter(this, void 0, void 0, function* () {
                return value
                    .plus(yield v.getAccountLockedGoldRequirement(account))
                    .isLessThanOrEqualTo(yield l.getAccountNonvotingLockedGold(account));
            })));
        };
        this.isNotValidatorGroupMember = () => {
            return this.addCheck(`Account isn't a member of a validator group`, this.withValidators((v, _signer, account) => __awaiter(this, void 0, void 0, function* () {
                const { affiliation } = yield v.getValidator(account);
                if (!affiliation || address_1.eqAddress(affiliation, address_1.NULL_ADDRESS)) {
                    return true;
                }
                const { members } = yield v.getValidatorGroup(affiliation);
                return !members.includes(account);
            })));
        };
        this.validatorDeregisterDurationPassed = () => {
            return this.addCheck(`Enough time has passed since the account was removed from a validator group`, this.withValidators((v, _signer, account) => __awaiter(this, void 0, void 0, function* () {
                const { lastRemovedFromGroupTimestamp } = yield v.getValidatorMembershipHistoryExtraData(account);
                const { duration } = yield v.getValidatorLockedGoldRequirements();
                return duration.toNumber() + lastRemovedFromGroupTimestamp < Date.now() / 1000;
            })));
        };
        this.resetSlashingmultiplierPeriodPassed = () => {
            return this.addCheck(`Enough time has passed since the last halving of the slashing multiplier`, this.withValidators((v, _signer, account) => __awaiter(this, void 0, void 0, function* () {
                const { lastSlashed } = yield v.getValidatorGroup(account);
                const duration = yield v.getSlashingMultiplierResetPeriod();
                return duration.toNumber() + lastSlashed.toNumber() < Date.now() / 1000;
            })));
        };
        this.hasACommissionUpdateQueued = () => this.addCheck("There's a commision update queued", this.withValidators((v, _signer, account) => __awaiter(this, void 0, void 0, function* () {
            const vg = yield v.getValidatorGroup(account);
            return !vg.nextCommissionBlock.eq(0);
        })));
        this.hasCommissionUpdateDelayPassed = () => this.addCheck('The Commission update delay has already passed', this.withValidators((v, _signer, account, ctx) => __awaiter(this, void 0, void 0, function* () {
            const blockNumber = yield ctx.web3.eth.getBlockNumber();
            const vg = yield v.getValidatorGroup(account);
            return vg.nextCommissionBlock.lte(blockNumber);
        })));
        this.isMultiSigOwner = (from, multisig) => {
            return this.addCheck('The provided address is an owner of the multisig', () => __awaiter(this, void 0, void 0, function* () {
                const owners = yield multisig.getOwners();
                return owners.indexOf(from) > -1;
            }));
        };
    }
    get web3() {
        return this.cmd.web3;
    }
    get kit() {
        return this.cmd.kit;
    }
    withValidators(f) {
        return () => __awaiter(this, void 0, void 0, function* () {
            const validators = yield this.kit.contracts.getValidators();
            if (this.signer) {
                const account = yield validators.signerToAccount(this.signer);
                return f(validators, this.signer, account, this);
            }
            else {
                return f(validators, '', '', this);
            }
        });
    }
    withLockedGold(f) {
        return () => __awaiter(this, void 0, void 0, function* () {
            const lockedGold = yield this.kit.contracts.getLockedGold();
            const validators = yield this.kit.contracts.getValidators();
            if (this.signer) {
                const account = yield validators.signerToAccount(this.signer);
                return f(lockedGold, this.signer, account, validators);
            }
            else {
                return f(lockedGold, '', '', validators);
            }
        });
    }
    withAccounts(f) {
        return () => __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.kit.contracts.getAccounts();
            return f(accounts);
        });
    }
    withGovernance(f) {
        return () => __awaiter(this, void 0, void 0, function* () {
            const governance = yield this.kit.contracts.getGovernance();
            return f(governance);
        });
    }
    addCheck(name, predicate, errorMessage) {
        this.checks.push(check(name, predicate, errorMessage));
        return this;
    }
    addConditionalCheck(name, runCondition, predicate, errorMessage) {
        if (runCondition) {
            return this.addCheck(name, predicate, errorMessage);
        }
        return this;
    }
    runChecks() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Running Checks:`);
            let allPassed = true;
            for (const aCheck of this.checks) {
                const passed = yield aCheck.run();
                const status︎Str = chalk_1.default.bold(passed ? '✔' : '✘');
                const color = passed ? chalk_1.default.green : chalk_1.default.red;
                const msg = !passed && aCheck.errorMessage ? aCheck.errorMessage : '';
                console.log(color(`   ${status︎Str}  ${aCheck.name} ${msg}`));
                allPassed = allPassed && passed;
            }
            if (!allPassed) {
                return this.cmd.error("Some checks didn't pass!");
            }
        });
    }
}
//# sourceMappingURL=checks.js.map