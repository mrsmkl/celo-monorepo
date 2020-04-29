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
Object.defineProperty(exports, "__esModule", { value: true });
var BaseWrapper_1 = require("./BaseWrapper");
/**
 * Contract for handling reserve for stable currencies
 */
var EpochRewardsWrapper = /** @class */ (function (_super) {
    __extends(EpochRewardsWrapper, _super);
    function EpochRewardsWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getRewardsMultiplier = BaseWrapper_1.proxyCall(_this.contract.methods.getRewardsMultiplier);
        _this.getTargetGoldTotalSupply = BaseWrapper_1.proxyCall(_this.contract.methods.getTargetGoldTotalSupply);
        return _this;
    }
    return EpochRewardsWrapper;
}(BaseWrapper_1.BaseWrapper));
exports.EpochRewardsWrapper = EpochRewardsWrapper;
//# sourceMappingURL=EpochRewardsWrapper.js.map