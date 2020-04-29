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
const async_1 = require("@celo/utils/lib/async");
const command_1 = require("@oclif/command");
const chalk_1 = __importDefault(require("chalk"));
const base_1 = require("../../base");
const command_2 = require("../../utils/command");
const election_1 = require("../../utils/election");
class ValidatorSignedBlocks extends base_1.BaseCommand {
    run() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorSignedBlocks);
            const election = yield this.kit.contracts.getElection();
            const validators = yield this.kit.contracts.getValidators();
            const epochSize = yield validators.getEpochSize();
            const electionCache = new election_1.ElectionResultsCache(election, epochSize.toNumber());
            const latest = (_a = res.flags['at-block'], (_a !== null && _a !== void 0 ? _a : (yield this.web3.eth.getBlock('latest')).number));
            const blocks = yield async_1.concurrentMap(10, [...Array(res.flags.lookback).keys()], (i) => this.web3.eth.getBlock(latest - res.flags.lookback + i + 1));
            const printer = new MarkPrinter(res.flags.width);
            try {
                for (const block of blocks) {
                    const elected = yield electionCache.elected(res.flags.signer, block.number - 1);
                    const signed = elected && (yield electionCache.signedParent(res.flags.signer, block));
                    printer.addMark(block.number - 1, elected, signed);
                }
                // TODO(victor) Fix the follow flag functionality.
                /*
                if (res.flags.follow) {
                  const subscription = this.web3.eth.subscribe("newBlockHeaders", (error) =>  {
                    if (error) { this.error(error) }
                  }).on("data", (block) => {
                    const elected = electionCache.elected(res.flags.signer, block.number)
                    const signed = elected && electionCache.signed(res.flags.signer, block)
                    printer.addMark(block.number, elected, signed)
                  }).on("error", (error) => {
                    this.error(`error in block header subscription: ${error}`)
                  })
          
                  try {
                    let response: string
                    do {
                      response = await cli.prompt('', {prompt: '', type: 'single', required: false})
                    } while (response !== 'q' && response !== '\u0003' / ctrl-c /)
                  } finally {
                    await subscription.unsubscribe()
                  }
                }
                */
            }
            finally {
                yield printer.done();
            }
        });
    }
}
exports.default = ValidatorSignedBlocks;
ValidatorSignedBlocks.description = "Display a graph of blocks and whether the given signer's signature is included in each. A green '.' indicates the signature is present in that block, a red '✘' indicates the signature is not present. A yellow '~' indicates the signer is not elected for that block.";
ValidatorSignedBlocks.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses()), { signer: command_2.Flags.address({
        description: 'address of the signer to check for signatures',
        required: true,
    }), 'at-block': command_1.flags.integer({
        description: 'latest block to examine for sginer activity',
        exclusive: ['follow'],
    }), lookback: command_1.flags.integer({
        description: 'how many blocks to look back for signer activity',
        default: 120,
    }), width: command_1.flags.integer({
        description: 'line width for printing marks',
        default: 40,
    }) });
ValidatorSignedBlocks.examples = [
    'heartbeat --signer 0x5409ED021D9299bf6814279A6A1411A7e866A631',
    'heartbeat --at-block 100000 --signer 0x5409ED021D9299bf6814279A6A1411A7e866A631',
    'heartbeat --lookback 500 --signer 0x5409ED021D9299bf6814279A6A1411A7e866A631',
    'heartbeat --lookback 50 --width 10 --signer 0x5409ED021D9299bf6814279A6A1411A7e866A631',
];
/**
 * Printer object to output marks in a grid to indicate signing status.
 */
// tslint:disable-next-line:max-classes-per-file
class MarkPrinter {
    constructor(width) {
        this.width = width;
        this.previousBlockNumber = null;
    }
    addMark(blockNumber, elected, signed) {
        if (this.previousBlockNumber === null) {
            const labelNumber = Math.floor(blockNumber / this.width) * this.width;
            this.previousBlockNumber = labelNumber - 1;
        }
        if (blockNumber <= this.previousBlockNumber - 1) {
            throw new Error(`cannot add mark for ${blockNumber} which is not after ${this.previousBlockNumber}`);
        }
        for (let i = this.previousBlockNumber + 1; i <= blockNumber; i++) {
            if (i % this.width === 0) {
                this.printLineLabel(i);
            }
            if (i < blockNumber) {
                process.stdout.write(' ');
            }
            else {
                process.stdout.write(this.mark(elected, signed));
            }
        }
        this.previousBlockNumber = blockNumber;
    }
    done() {
        return __awaiter(this, void 0, void 0, function* () {
            // Print a final newline to complete the line.
            return new Promise((resolve, reject) => {
                process.stdout.write('\n', (err) => {
                    err ? reject(err) : resolve();
                });
            });
        });
    }
    mark(elected, signed) {
        return elected ? (signed ? chalk_1.default.green('.') : chalk_1.default.red('✘')) : chalk_1.default.yellow('~');
    }
    printLineLabel(blockNumber, newline = true) {
        if (newline) {
            process.stdout.write('\n');
        }
        process.stdout.write(`${blockNumber} `.padStart(8, ' '));
    }
}
//# sourceMappingURL=signed-blocks.js.map