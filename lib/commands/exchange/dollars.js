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
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
class ExchangeDollars extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ExchangeDollars);
            const sellAmount = res.flags.value;
            const minBuyAmount = res.flags.forAtLeast;
            this.kit.defaultAccount = res.flags.from;
            const stableToken = yield this.kit.contracts.getStableToken();
            const exchange = yield this.kit.contracts.getExchange();
            yield cli_1.displaySendTx('increaseAllowance', stableToken.increaseAllowance(exchange.address, sellAmount.toFixed()));
            const exchangeTx = exchange.exchange(sellAmount.toFixed(), minBuyAmount.toFixed(), false);
            // Set explicit gas based on github.com/celo-org/celo-monorepo/issues/2541
            yield cli_1.displaySendTx('exchange', exchangeTx, { gas: 300000 });
        });
    }
}
exports.default = ExchangeDollars;
ExchangeDollars.description = 'Exchange Celo Dollars for Celo Gold via the stability mechanism';
ExchangeDollars.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({
        required: true,
        description: 'The address with Celo Dollars to exchange',
    }), value: command_1.Flags.wei({
        required: true,
        description: 'The value of Celo Dollars to exchange for Celo Gold',
    }), forAtLeast: command_1.Flags.wei({
        description: 'Optional, the minimum value of Celo Gold to receive in return',
        default: new bignumber_js_1.default(0),
    }) });
ExchangeDollars.args = [];
ExchangeDollars.examples = [
    'dollars --value 10000000000000 --from 0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d',
    'dollars --value 10000000000000 --forAtLeast 50000000000000 --from 0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d',
];
//# sourceMappingURL=dollars.js.map