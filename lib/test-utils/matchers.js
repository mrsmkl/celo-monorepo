"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
expect.extend({
    toBeBigNumber(received) {
        const pass = bignumber_js_1.default.isBigNumber(received);
        if (pass) {
            return {
                message: () => `expected ${received} not to be BigNumber`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be bigNumber`,
                pass: false,
            };
        }
    },
    toEqBigNumber(received, _expected) {
        const expected = new bignumber_js_1.default(_expected);
        const pass = expected.eq(received);
        if (pass) {
            return {
                message: () => `expected ${received.toString()} not to equal ${expected.toString()}`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received.toString()} to equal ${expected.toString()}`,
                pass: false,
            };
        }
    },
});
//# sourceMappingURL=matchers.js.map