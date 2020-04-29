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
const cli_1 = require("./cli");
function nodeIsSynced(web3) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NO_SYNCCHECK) {
            return true;
        }
        try {
            // isSyncing() returns an object describing sync progress if syncing is actively
            // happening, and the boolean value `false` if not.
            // However, `false` can also indicate the syncing hasn't started, so here we
            // also need to check the latest block number
            const syncProgress = yield web3.eth.isSyncing();
            if (typeof syncProgress === 'boolean' && !syncProgress) {
                const latestBlock = yield web3.eth.getBlock('latest');
                if (latestBlock && latestBlock.number > 0) {
                    // To catch the case in which syncing has happened in the past,
                    // has stopped, and hasn't started again, check for an old timestamp
                    // on the latest block
                    const ageOfBlock = Date.now() / 1000 - Number(latestBlock.timestamp);
                    if (ageOfBlock > 120) {
                        console.log(`Latest block is ${ageOfBlock} seconds old, and syncing is not currently in progress`);
                        console.log('To disable this check, set the NO_SYNCCHECK environment variable');
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
            return false;
        }
        catch (error) {
            console.log("An error occurred while trying to reach the node. Perhaps your node isn't running?");
            return false;
        }
    });
}
exports.nodeIsSynced = nodeIsSynced;
function requireNodeIsSynced(web3) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield nodeIsSynced(web3))) {
            cli_1.failWith('Node is not currently synced. Run node:synced to check its status.');
        }
    });
}
exports.requireNodeIsSynced = requireNodeIsSynced;
exports.NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
//# sourceMappingURL=helpers.js.map