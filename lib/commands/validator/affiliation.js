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
var ValidatorAffiliate = /** @class */ (function (_super) {
    __extends(ValidatorAffiliate, _super);
    function ValidatorAffiliate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValidatorAffiliate.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, validators;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = this.parse(ValidatorAffiliate);
                        this.kit.defaultAccount = res.flags.from;
                        return [4 /*yield*/, this.kit.contracts.getValidators()];
                    case 1:
                        validators = _a.sent();
                        if (!(res.flags.set || res.flags.unset)) {
                            this.error("Specify action: --set or --unset");
                            return [2 /*return*/];
                        }
                        if (!res.flags.set) return [3 /*break*/, 3];
                        return [4 /*yield*/, cli_1.displaySendTx('affiliate', validators.affiliate(res.flags.set))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!res.flags.unset) return [3 /*break*/, 5];
                        return [4 /*yield*/, cli_1.displaySendTx('deaffiliate', validators.deaffiliate())];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ValidatorAffiliate.description = 'Manage affiliation to a ValidatorGroup';
    ValidatorAffiliate.flags = __assign({}, base_1.BaseCommand.flags, { from: command_2.Flags.address({ required: true, description: "Validator's address" }), unset: command_1.flags.boolean({ exclusive: ['set'], description: 'clear affiliation field' }), set: command_2.Flags.address({
            description: 'set affiliation to given address',
            exclusive: ['unset'],
        }) });
    ValidatorAffiliate.examples = [
        'affiliation --set 0x97f7333c51897469e8d98e7af8653aab468050a3 --from 0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95',
        'affiliation --unset --from 0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95',
    ];
    return ValidatorAffiliate;
}(base_1.BaseCommand));
exports.default = ValidatorAffiliate;
//# sourceMappingURL=affiliation.js.map