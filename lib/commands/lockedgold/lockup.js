"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("@oclif/command");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var base_1 = require("../../base");
var cli_1 = require("../../utils/cli");
var command_2 = require("../../utils/command");
var lockedgold_1 = require("../../utils/lockedgold");
var Commitment = /** @class */ (function (_super) {
    __extends(Commitment, _super);
    function Commitment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Commitment.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, address, lockedGold, noticePeriod, goldAmount, maxNoticePeriod, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = this.parse(Commitment);
                        address = res.flags.from;
                        this.kit.defaultAccount = address;
                        return [4 /*yield*/, this.kit.contracts.getLockedGold()];
                    case 1:
                        lockedGold = _a.sent();
                        noticePeriod = new bignumber_js_1.default(res.flags.noticePeriod);
                        goldAmount = new bignumber_js_1.default(res.flags.goldAmount);
                        return [4 /*yield*/, lockedGold.isVoting(address)];
                    case 2:
                        if (!(_a.sent())) {
                            cli_1.failWith("require(!isVoting(address)) => false");
                        }
                        return [4 /*yield*/, lockedGold.maxNoticePeriod()];
                    case 3:
                        maxNoticePeriod = _a.sent();
                        if (!maxNoticePeriod.gte(noticePeriod)) {
                            cli_1.failWith("require(noticePeriod <= maxNoticePeriod) => [" + noticePeriod + ", " + maxNoticePeriod + "]");
                        }
                        if (!goldAmount.gt(new bignumber_js_1.default(0))) {
                            cli_1.failWith("require(goldAmount > 0) => [" + goldAmount + "]");
                        }
                        tx = lockedGold.newCommitment(noticePeriod.toString());
                        return [4 /*yield*/, cli_1.displaySendTx('lockup', tx, { value: goldAmount.toString() })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Commitment.description = 'Create a Locked Gold commitment given notice period and gold amount';
    Commitment.flags = __assign({}, base_1.BaseCommand.flags, { from: command_1.flags.string(__assign({}, command_2.Flags.address, { required: true })), noticePeriod: command_1.flags.string(__assign({}, lockedgold_1.LockedGoldArgs.noticePeriodArg, { required: true })), goldAmount: command_1.flags.string(__assign({}, lockedgold_1.LockedGoldArgs.goldAmountArg, { required: true })) });
    Commitment.args = [];
    Commitment.examples = [
        'lockup --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --noticePeriod 8640 --goldAmount 1000000000000000000',
    ];
    return Commitment;
}(base_1.BaseCommand));
exports.default = Commitment;
//# sourceMappingURL=lockup.js.map