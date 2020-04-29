"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
function jsonRpcCall(web3, method, params) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            id: new Date().getTime(),
            jsonrpc: '2.0',
            method,
            params,
        }, (err, res) => {
            if (err) {
                reject(err);
            }
            else if (!res) {
                reject(new Error('no response'));
            }
            else if (res.error) {
                reject(new Error(`Failed JsonRPCResponse: method: ${method} params: ${params} error: ${JSON.stringify(res.error)}`));
            }
            else {
                resolve(res.result);
            }
        });
    });
}
exports.jsonRpcCall = jsonRpcCall;
function evmRevert(web3, snapId) {
    return jsonRpcCall(web3, 'evm_revert', [snapId]);
}
exports.evmRevert = evmRevert;
function evmSnapshot(web3) {
    return jsonRpcCall(web3, 'evm_snapshot', []);
}
exports.evmSnapshot = evmSnapshot;
function testWithGanache(name, fn) {
    const web3 = new web3_1.default('http://localhost:8545');
    describe(name, () => {
        let snapId = null;
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            if (snapId != null) {
                yield evmRevert(web3, snapId);
            }
            snapId = yield evmSnapshot(web3);
        }));
        afterAll(() => __awaiter(this, void 0, void 0, function* () {
            if (snapId != null) {
                yield evmRevert(web3, snapId);
            }
        }));
        fn(web3);
    });
}
exports.testWithGanache = testWithGanache;
//# sourceMappingURL=ganache-test.js.map