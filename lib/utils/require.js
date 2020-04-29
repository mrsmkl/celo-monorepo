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
var Op;
(function (Op) {
    Op["EQ"] = "EQ";
    Op["NEQ"] = "NEQ";
    Op["LT"] = "LT";
    Op["LTE"] = "LTE";
    Op["GT"] = "GT";
    Op["GTE"] = "GTE";
})(Op = exports.Op || (exports.Op = {}));
function requireOp(value, op, expected, ctx) {
    const OpFn = {
        [Op.EQ]: (a, b) => a === b,
        [Op.NEQ]: (a, b) => a !== b,
        [Op.LT]: (a, b) => a < b,
        [Op.LTE]: (a, b) => a <= b,
        [Op.GT]: (a, b) => a > b,
        [Op.GTE]: (a, b) => a >= b,
    };
    if (!OpFn[op](value, expected)) {
        cli_1.failWith(`require(${ctx}) => [${value}, ${expected}]`);
    }
}
exports.requireOp = requireOp;
function requireCall(callPromise, op, expected, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const value = yield callPromise.call();
        requireOp(value, op, expected, ctx);
    });
}
exports.requireCall = requireCall;
//# sourceMappingURL=require.js.map