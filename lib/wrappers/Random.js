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
 * Currency price oracle contract.
 */
var RandomWrapper = /** @class */ (function (_super) {
    __extends(RandomWrapper, _super);
    function RandomWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Returns the current randomness value
         * @returns Current randomness value.
         */
        _this.random = BaseWrapper_1.proxyCall(_this.contract.methods.random);
        return _this;
    }
    return RandomWrapper;
}(BaseWrapper_1.BaseWrapper));
exports.RandomWrapper = RandomWrapper;
//# sourceMappingURL=Random.js.map