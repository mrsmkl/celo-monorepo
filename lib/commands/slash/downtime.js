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
const collections_1 = require("@celo/utils/lib/collections");
const command_1 = require("@oclif/command");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const base_1 = require("../../base");
const command_2 = require("../../utils/command");
// Returns how much voting gold will be decremented from the groups voted by an account
function slashingOfGroups(kit, account, penalty) {
    return __awaiter(this, void 0, void 0, function* () {
        const election = yield kit.contracts.getElection();
        const lockedGold = yield kit.contracts.getLockedGold();
        // first check how much voting gold has to be slashed
        const nonVoting = new bignumber_js_1.default(yield lockedGold.getAccountNonvotingLockedGold(account));
        if (penalty.isLessThan(nonVoting)) {
            return [];
        }
        let difference = penalty.minus(nonVoting);
        // find voted groups
        const groups = yield election.getGroupsVotedForByAccount(account);
        const res = [];
        //
        for (let i = groups.length - 1; i >= 0; i--) {
            const group = groups[i];
            console.log('checking group', group);
            const totalVotes = new bignumber_js_1.default(yield election.getTotalVotesForGroup(group));
            const votes = new bignumber_js_1.default(yield election.getTotalVotesForGroupByAccount(group, account));
            const slashedVotes = votes.lt(difference) ? votes : difference;
            console.log('group votes', totalVotes);
            console.log('group votes by account', votes);
            console.log('group votes to slash', slashedVotes);
            res.push({ address: group, value: slashedVotes, index: i });
            difference = difference.minus(slashedVotes);
            if (difference.eq(new bignumber_js_1.default(0))) {
                break;
            }
        }
        return res;
    });
}
function findLessersAndGreaters(kit, account, group, penalty) {
    return __awaiter(this, void 0, void 0, function* () {
        const election = yield kit.contracts.getElection();
        const groups = (yield election.getEligibleValidatorGroupsVotes()).map(({ votes, address }) => ({
            value: votes,
            address,
        }));
        // console.log('original state --------------------')
        // printList(groups)
        const changed = yield slashingOfGroups(kit, account, penalty);
        const changedGroup = yield slashingOfGroups(kit, group, penalty);
        const afterValidator = collections_1.linkedListChangesRel(groups, changed);
        // console.log('after slashing validator -------------')
        // printList(afterValidator.list)
        const afterGroup = collections_1.linkedListChangesRel(afterValidator.list, changedGroup);
        // console.log('after slashing group --------------------')
        // printList(afterGroup.list)
        return {
            afterValidator,
            afterGroup,
            indicesValidator: changed.map((a) => a.index),
            indicesGroup: changedGroup.map((a) => a.index),
        };
    });
}
function findIndex(kit, address, block) {
    return __awaiter(this, void 0, void 0, function* () {
        const election = yield kit.contracts.getElection();
        const accounts = yield kit.contracts.getAccounts();
        const signers = yield election.getCurrentValidatorSigners(block);
        let acc = 0;
        for (const it of signers) {
            const addr = yield accounts.signerToAccount(it);
            // console.log(it, '->', addr)
            if (addr === address)
                return acc;
            acc++;
        }
        return -1;
    });
}
class Downtime extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Downtime);
            const kit = this.kit;
            const block = res.flags.block;
            const slasher = yield kit.contracts.getDowntimeSlasher();
            // const election = await kit._web3Contracts.getElection()
            const period = yield slasher.slashableDowntime();
            const endBlock = block + period;
            console.log('Slashable downtime', period);
            /*
            const startEpoch = await slasher.methods.getEpochNumberOfBlock(block).call()
            const endEpoch = await slasher.methods.getEpochNumberOfBlock(endBlock).call()
        
            console.log(
              `starting at block ${block} (epoch ${startEpoch}), ending at ${endBlock} (epoch ${endEpoch})`
            )*/
            const address = res.args.address;
            const startIndex = yield findIndex(kit, address, block);
            const endIndex = yield findIndex(kit, address, endBlock);
            console.log('start index', startIndex, 'end index', endIndex);
            const validators = yield kit.contracts.getValidators();
            const history = yield validators.getValidatorMembershipHistory(address);
            const historyIndex = history.length - 1;
            console.log('history', history, 'guessing history index', historyIndex);
            const group = history[historyIndex].group;
            const incentives = yield slasher.slashingIncentives();
            console.log('incentives', incentives);
            const penalty = new bignumber_js_1.default(incentives.penalty);
            const data = yield findLessersAndGreaters(kit, address, group, penalty);
            console.log(data.afterValidator.lessers, data.afterValidator.greaters, data.indicesValidator);
            console.log(data.afterGroup.lessers, data.afterGroup.greaters, data.indicesGroup);
            yield slasher.slashValidator(address, block);
            /*
            const test = await slasher.methods
              .isDown(block, startIndex, endIndex)
              // @ts-ignore
              .call({ gas: 10000000 }, endBlock + 100)
            console.log('is down: ', test)
        
            console.log('dry run of slashing')
            // doesn't wait for error, so just have to check from geth log or something
            const dry = await slasher.methods
              .slash(
                block,
                startIndex,
                endIndex,
                historyIndex,
                data.afterValidator.lessers,
                data.afterValidator.greaters,
                data.indicesValidator,
                data.afterGroup.lessers,
                data.afterGroup.greaters,
                data.indicesGroup
              )
              // @ts-ignore
              .call({ gas: 10000000 })
            console.log('got', dry)
            */
        });
    }
}
exports.default = Downtime;
Downtime.description = 'Slash for downtime';
Downtime.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { block: command_1.flags.integer(Object.assign(Object.assign({}, command_2.Flags.block), { required: true })) });
Downtime.args = [command_2.Args.address('address')];
Downtime.examples = ['downtime 0x5409ed021d9299bf6814279a6a1411a7e866a631 --block 12300'];
//# sourceMappingURL=downtime.js.map