"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
function promiEventSpy() {
    const ee = new events_1.EventEmitter();
    const pe = {
        catch: () => {
            throw new Error('not implemented');
        },
        then: () => {
            throw new Error('not implemented');
        },
        finally: () => {
            throw new Error('not implemented');
        },
        on: ((event, listener) => ee.on(event, listener)),
        once: ((event, listener) => ee.once(event, listener)),
        [Symbol.toStringTag]: 'Not Implemented',
        emitter: ee,
        resolveHash: (hash) => {
            ee.emit('transactionHash', hash);
        },
        resolveReceipt: (receipt) => {
            ee.emit('receipt', receipt);
        },
        rejectHash: (error) => {
            ee.emit('error', error, false);
        },
        rejectReceipt: (receipt, error) => {
            ee.emit('error', error, receipt);
        },
    };
    return pe;
}
exports.promiEventSpy = promiEventSpy;
//# sourceMappingURL=PromiEventStub.js.map