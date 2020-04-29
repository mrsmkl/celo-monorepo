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
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("@celo/utils/lib/address");
const async_1 = require("@celo/utils/lib/async");
const command_1 = require("@oclif/command");
const cli_ux_1 = require("cli-ux");
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const command_2 = require("../../utils/command");
const election_1 = require("../../utils/election");
exports.statusTable = {
    address: {},
    name: {},
    signer: {},
    elected: {},
    frontRunner: {},
    proposed: { get: (v) => (v.elected || v.proposed ? v.proposed : '') },
    signatures: {
        get: (v) => isNaN(v.signatures) ? '' : Math.round(v.signatures * 100) + '%',
    },
};
class ValidatorStatus extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorStatus);
            const accounts = yield this.kit.contracts.getAccounts();
            const validators = yield this.kit.contracts.getValidators();
            const election = yield this.kit.contracts.getElection();
            // Resolve the signer address(es) from the provide flags.
            let signers = [];
            const checker = checks_1.newCheckBuilder(this);
            if (res.flags.signer) {
                signers = [res.flags.signer];
                const validator = yield accounts.signerToAccount(res.flags.signer);
                checker.isAccount(validator).isValidator(validator);
                yield checker.runChecks();
            }
            else if (res.flags.validator) {
                checker.isAccount(res.flags.validator).isValidator(res.flags.validator);
                yield checker.runChecks();
                const signer = yield accounts.getValidatorSigner(res.flags.validator);
                signers = [signer];
            }
            else {
                signers = yield async_1.concurrentMap(10, yield validators.getRegisteredValidatorsAddresses(), (a) => accounts.getValidatorSigner(a));
            }
            if (res.flags.lookback < 0) {
                this.error('lookback value must be greater than or equal to zero');
            }
            // Fetch the blocks to consider for signature percentages.
            const latest = yield this.web3.eth.getBlock('latest');
            let blocks;
            if (res.flags.lookback > 1) {
                cli_ux_1.cli.action.start(`Fetching ${res.flags.lookback} blocks`);
                blocks = yield async_1.concurrentMap(10, [...Array(res.flags.lookback).keys()], (i) => this.web3.eth.getBlock(latest.number - i));
                cli_ux_1.cli.action.stop();
            }
            else {
                blocks = [latest];
            }
            cli_ux_1.cli.action.start(`Calculating status information`);
            const epochSize = yield validators.getEpochSize();
            const electionCache = new election_1.ElectionResultsCache(election, epochSize.toNumber());
            let frontRunnerSigners = [];
            try {
                frontRunnerSigners = yield election.electValidatorSigners();
            }
            catch (err) {
                console.warn('Warning: Elections not available');
            }
            const validatorStatuses = yield async_1.concurrentMap(10, signers, (s) => this.getStatus(s, blocks, electionCache, frontRunnerSigners));
            cli_ux_1.cli.action.stop();
            cli_ux_1.cli.table(validatorStatuses, exports.statusTable, { 'no-truncate': !res.flags.truncate });
        });
    }
    getStatus(signer, blocks, electionCache, frontRunnerSigners) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.kit.contracts.getAccounts();
            const validators = yield this.kit.contracts.getValidators();
            const validator = yield accounts.signerToAccount(signer);
            let name = 'Unregistered validator';
            if (yield validators.isValidator(validator)) {
                name = (yield accounts.getName(validator)) || '';
            }
            const proposedCount = blocks.filter((b) => address_1.eqAddress(b.miner, signer)).length;
            let signatures = 0;
            let eligible = 0;
            for (const block of blocks) {
                if (yield electionCache.elected(signer, block.number - 1)) {
                    eligible++;
                    if (yield electionCache.signedParent(signer, block)) {
                        signatures++;
                    }
                }
            }
            return {
                name,
                address: validator,
                signer,
                elected: yield electionCache.elected(signer, blocks[0].number),
                frontRunner: frontRunnerSigners.some(address_1.eqAddress.bind(null, signer)),
                proposed: proposedCount,
                signatures: signatures / eligible,
            };
        });
    }
}
exports.default = ValidatorStatus;
ValidatorStatus.description = 'Shows the consensus status of a validator. This command will show whether a validator is currently elected, would be elected if an election were to be run right now, and the percentage of blocks signed and number of blocks successfully proposed within a given window.';
ValidatorStatus.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses()), { validator: command_2.Flags.address({
        description: 'address of the validator to check if elected and validating',
        exclusive: ['all', 'signer'],
    }), signer: command_2.Flags.address({
        description: 'address of the signer to check if elected and validating',
        exclusive: ['validator', 'all'],
    }), all: command_1.flags.boolean({
        description: 'get the status of all registered validators',
        exclusive: ['validator', 'signer'],
    }), lookback: command_1.flags.integer({
        description: 'how many blocks to look back for signer activity',
        default: 100,
    }) });
ValidatorStatus.examples = [
    'status --validator 0x5409ED021D9299bf6814279A6A1411A7e866A631',
    'status --all --lookback 100',
];
//# sourceMappingURL=status.js.map