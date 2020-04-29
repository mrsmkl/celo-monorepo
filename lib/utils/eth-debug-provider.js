"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const debugPayload = debug_1.default('web:rpc:payload');
const debugResponse = debug_1.default('web:rpc:response');
class DebugProvider {
    constructor(provider) {
        this.provider = provider;
    }
    send(payload, callback) {
        debugPayload('%O', payload);
        const callbackDecorator = (error, result) => {
            debugResponse('%O', result);
            callback(error, result);
        };
        return this.provider.send(payload, callbackDecorator);
    }
}
function wrap(provider) {
    return new DebugProvider(provider);
}
exports.wrap = wrap;
function injectDebugProvider(web3) {
    web3.setProvider(wrap(web3.currentProvider));
}
exports.injectDebugProvider = injectDebugProvider;
//# sourceMappingURL=eth-debug-provider.js.map