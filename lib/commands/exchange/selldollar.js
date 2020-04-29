"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
const exchange_1 = require("../../utils/exchange");
class SellDollar extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args } = this.parse(SellDollar);
            const sellAmount = new bignumber_js_1.default(args.sellAmount);
            const minBuyAmount = new bignumber_js_1.default(args.minBuyAmount);
            this.kit.defaultAccount = args.from;
            const stableToken = yield this.kit.contracts.getStableToken();
            const exchange = yield this.kit.contracts.getExchange();
            yield cli_1.displaySendTx('approve', stableToken.approve(exchange.address, sellAmount.toString()));
            const exchangeTx = exchange.exchange(sellAmount.toString(), minBuyAmount.toString(), false);
            yield cli_1.displaySendTx('exchange', exchangeTx);
        });
    }
}
SellDollar.description = 'Sell Celo dollars for Celo gold on the exchange';
SellDollar.args = exchange_1.swapArguments;
SellDollar.examples = ['selldollar 100 300 0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d'];
exports.default = SellDollar;
//# sourceMappingURL=selldollar.js.map