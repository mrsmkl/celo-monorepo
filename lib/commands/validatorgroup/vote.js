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
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("@oclif/command");
var base_1 = require("../../base");
var cli_1 = require("../../utils/cli");
var command_2 = require("../../utils/command");
var ValidatorGroupVote = /** @class */ (function (_super) {
    __extends(ValidatorGroupVote, _super);
    function ValidatorGroupVote() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValidatorGroupVote.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, validators, lockedGold, details, myVote, tx, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = this.parse(ValidatorGroupVote);
                        this.kit.defaultAccount = res.flags.from;
                        return [4 /*yield*/, this.kit.contracts.getValidators()];
                    case 1:
                        validators = _a.sent();
                        if (!res.flags.current) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.kit.contracts.getLockedGold()];
                    case 2:
                        lockedGold = _a.sent();
                        return [4 /*yield*/, lockedGold.getVotingDetails(res.flags.from)];
                    case 3:
                        details = _a.sent();
                        return [4 /*yield*/, validators.getVoteFrom(details.accountAddress)];
                    case 4:
                        myVote = _a.sent();
                        cli_1.printValueMap(__assign({}, details, { currentVote: myVote }));
                        return [3 /*break*/, 12];
                    case 5:
                        if (!res.flags.revoke) return [3 /*break*/, 8];
                        return [4 /*yield*/, validators.revokeVote()];
                    case 6:
                        tx = _a.sent();
                        return [4 /*yield*/, cli_1.displaySendTx('revokeVote', tx)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 8:
                        if (!res.flags.for) return [3 /*break*/, 11];
                        return [4 /*yield*/, validators.vote(res.flags.for)];
                    case 9:
                        tx = _a.sent();
                        return [4 /*yield*/, cli_1.displaySendTx('vote', tx)];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        this.error('Use one of --for, --current, --revoke');
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ValidatorGroupVote.description = 'Vote for a Validator Group';
    ValidatorGroupVote.flags = __assign({}, base_1.BaseCommand.flags, { from: command_2.Flags.address({ required: true, description: "Voter's address" }), current: command_1.flags.boolean({
            exclusive: ['revoke', 'for'],
            description: "Show voter's current vote",
        }), revoke: command_1.flags.boolean({
            exclusive: ['current', 'for'],
            description: "Revoke voter's current vote",
        }), for: command_2.Flags.address({
            exclusive: ['current', 'revoke'],
            description: "Set vote for ValidatorGroup's address",
        }) });
    ValidatorGroupVote.examples = [
        'vote --from 0x4443d0349e8b3075cba511a0a87796597602a0f1 --for 0x932fee04521f5fcb21949041bf161917da3f588b',
        'vote --from 0x4443d0349e8b3075cba511a0a87796597602a0f1 --revoke',
        'vote --from 0x4443d0349e8b3075cba511a0a87796597602a0f1 --current',
    ];
    return ValidatorGroupVote;
}(base_1.BaseCommand));
exports.default = ValidatorGroupVote;
//# sourceMappingURL=vote.js.map