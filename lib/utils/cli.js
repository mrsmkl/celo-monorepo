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
const web3_utils_1 = require("@celo/contractkit/lib/utils/web3-utils");
const errors_1 = require("@oclif/errors");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const chalk_1 = __importDefault(require("chalk"));
const cli_table_1 = __importDefault(require("cli-table"));
const cli_ux_1 = require("cli-ux");
function displaySendTx(name, txObj, tx, displayEventName) {
    return __awaiter(this, void 0, void 0, function* () {
        cli_ux_1.cli.action.start(`Sending Transaction: ${name}`);
        const txResult = yield txObj.send(tx);
        const txHash = yield txResult.getHash();
        console.log(chalk_1.default `SendTransaction: {red.bold ${name}}`);
        printValueMap({ txHash });
        const txReceipt = yield txResult.waitReceipt();
        cli_ux_1.cli.action.stop();
        if (displayEventName && txReceipt.events) {
            Object.entries(txReceipt.events)
                .filter(([eventName]) => eventName === displayEventName)
                .forEach(([eventName, log]) => {
                const { params } = web3_utils_1.parseDecodedParams(log.returnValues);
                console.log(chalk_1.default.magenta.bold(`${eventName}:`));
                printValueMap(params, chalk_1.default.magenta);
            });
        }
    });
}
exports.displaySendTx = displaySendTx;
function printValueMap(valueMap, color = chalk_1.default.red.bold) {
    console.log(Object.keys(valueMap)
        .map((key) => color(`${key}: `) + valueMap[key])
        .join('\n'));
}
exports.printValueMap = printValueMap;
function printValueMapRecursive(valueMap) {
    console.log(toStringValueMapRecursive(valueMap, ''));
}
exports.printValueMapRecursive = printValueMapRecursive;
function toStringValueMapRecursive(valueMap, prefix) {
    const printValue = (v) => {
        if (typeof v === 'object' && v != null) {
            if (bignumber_js_1.default.isBigNumber(v)) {
                const factor = new bignumber_js_1.default(10).pow(18);
                const extra = v.isGreaterThan(factor) ? `(~${v.div(factor).decimalPlaces(2)} 10^18)` : '';
                return `${v.toFixed()} ${extra}`;
            }
            return '\n' + toStringValueMapRecursive(v, prefix + '  ');
        }
        return chalk_1.default `${v}`;
    };
    return Object.keys(valueMap)
        .map((key) => prefix + chalk_1.default `{red.bold ${key}:} ${printValue(valueMap[key])}`)
        .join('\n');
}
function printVTable(valueMap) {
    const table = new cli_table_1.default();
    Object.keys(valueMap).forEach((key) => {
        table.push({ [key]: valueMap[key] });
    });
    console.log(table.toString());
}
exports.printVTable = printVTable;
function failWith(msg) {
    throw new errors_1.CLIError(msg);
}
exports.failWith = failWith;
function binaryPrompt(promptMessage, defaultToNo) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield cli_ux_1.cli.prompt(promptMessage + ` [y/yes, n/no${defaultToNo ? ' (default)' : ''}]`, { required: !defaultToNo });
        return ['y', 'yes'].includes(resp.toLowerCase());
    });
}
exports.binaryPrompt = binaryPrompt;
//# sourceMappingURL=cli.js.map