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
var contractkit_1 = require("@celo/contractkit");
var chalk_1 = __importDefault(require("chalk"));
var cli_ux_1 = require("cli-ux");
var base_1 = require("../../base");
var command_1 = require("../../utils/command");
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    List.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var args, lockedGold, commitments, delegates;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = this.parse(List).args;
                        cli_ux_1.cli.action.start('Fetching commitments and delegates...');
                        return [4 /*yield*/, this.kit.contracts.getLockedGold()];
                    case 1:
                        lockedGold = _a.sent();
                        return [4 /*yield*/, lockedGold.getCommitments(args.account)];
                    case 2:
                        commitments = _a.sent();
                        return [4 /*yield*/, Promise.all(Object.keys(contractkit_1.Roles).map(function (role) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = {
                                                role: role
                                            };
                                            return [4 /*yield*/, lockedGold.getDelegateFromAccountAndRole(args.account, contractkit_1.Roles[role])];
                                        case 1: return [2 /*return*/, (_a.address = _b.sent(),
                                                _a)];
                                    }
                                });
                            }); }))];
                    case 3:
                        delegates = _a.sent();
                        cli_ux_1.cli.action.stop();
                        cli_ux_1.cli.table(delegates, {
                            role: { header: 'Role', get: function (a) { return a.role; } },
                            delegate: { get: function (a) { return a.address; } },
                        });
                        cli_ux_1.cli.log(chalk_1.default.bold.yellow('Total Gold Locked \t') + commitments.total.gold);
                        cli_ux_1.cli.log(chalk_1.default.bold.red('Total Account Weight \t') + commitments.total.weight);
                        if (commitments.locked.length > 0) {
                            cli_ux_1.cli.table(commitments.locked, {
                                noticePeriod: { header: 'NoticePeriod', get: function (a) { return a.time.toString(); } },
                                value: { get: function (a) { return a.value.toString(); } },
                            });
                        }
                        if (commitments.notified.length > 0) {
                            cli_ux_1.cli.table(commitments.notified, {
                                availabilityTime: { header: 'AvailabilityTime', get: function (a) { return a.time.toString(); } },
                                value: { get: function (a) { return a.value.toString(); } },
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    List.description = "View information about all of the account's commitments";
    List.flags = __assign({}, base_1.BaseCommand.flags);
    List.args = [command_1.Args.address('account')];
    List.examples = ['list 0x5409ed021d9299bf6814279a6a1411a7e866a631'];
    return List;
}(base_1.BaseCommand));
exports.default = List;
//# sourceMappingURL=list.js.map