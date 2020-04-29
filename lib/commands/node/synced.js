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
const command_1 = require("@oclif/command");
const base_1 = require("../../base");
const helpers_1 = require("../../utils/helpers");
class NodeSynced extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.requireSynced = false;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(NodeSynced);
            if (res.flags.verbose) {
                const status = yield this.web3.eth.isSyncing();
                if (typeof status !== 'boolean') {
                    console.log(status);
                }
            }
            console.log(yield helpers_1.nodeIsSynced(this.web3));
        });
    }
}
exports.default = NodeSynced;
NodeSynced.description = 'Check if the node is synced';
NodeSynced.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses()), { verbose: command_1.flags.boolean({
        description: 'output the full status if syncing',
    }) });
//# sourceMappingURL=synced.js.map