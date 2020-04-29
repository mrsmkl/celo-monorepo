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
const BaseWrapper_1 = require("@celo/contractkit/lib/wrappers/BaseWrapper");
const async_1 = require("@celo/utils/lib/async");
const collections_1 = require("@celo/utils/lib/collections");
const chalk_1 = __importDefault(require("chalk"));
const cli_ux_1 = require("cli-ux");
const base_1 = require("../../base");
class List extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.parse(List);
            const governance = yield this.kit.contracts.getGovernance();
            const queue = yield governance.getQueue();
            const expiredQueueMap = yield async_1.concurrentMap(5, queue, (upvoteRecord) => governance.isQueuedProposalExpired(upvoteRecord.proposalID));
            const unexpiredQueue = queue.filter((_, idx) => !expiredQueueMap[idx]);
            const sortedQueue = governance.sortedQueue(unexpiredQueue);
            console.log(chalk_1.default.magenta.bold('Queued Proposals:'));
            cli_ux_1.cli.table(sortedQueue, {
                ID: { get: (p) => BaseWrapper_1.valueToString(p.proposalID) },
                upvotes: { get: (p) => BaseWrapper_1.valueToString(p.upvotes) },
            });
            const dequeue = yield governance.getDequeue(true);
            const expiredDequeueMap = yield async_1.concurrentMap(5, dequeue, governance.isDequeuedProposalExpired);
            const unexpiredDequeue = dequeue.filter((_, idx) => !expiredDequeueMap[idx]);
            const stages = yield async_1.concurrentMap(5, unexpiredDequeue, governance.getProposalStage);
            const proposals = collections_1.zip((proposalID, stage) => ({ proposalID, stage }), unexpiredDequeue, stages);
            console.log(chalk_1.default.blue.bold('Dequeued Proposals:'));
            cli_ux_1.cli.table(proposals, {
                ID: { get: (p) => BaseWrapper_1.valueToString(p.proposalID) },
                stage: {},
            });
            console.log(chalk_1.default.red.bold('Expired Proposals:'));
            const expiredQueue = queue
                .filter((_, idx) => expiredQueueMap[idx])
                .map((_, idx) => queue[idx].proposalID);
            const expiredDequeue = dequeue
                .filter((_, idx) => expiredDequeueMap[idx])
                .map((_, idx) => dequeue[idx]);
            cli_ux_1.cli.table(expiredQueue.concat(expiredDequeue), {
                ID: { get: (id) => BaseWrapper_1.valueToString(id) },
            });
        });
    }
}
exports.default = List;
List.description = 'List live governance proposals (queued and ongoing)';
List.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
List.examples = ['list'];
//# sourceMappingURL=list.js.map