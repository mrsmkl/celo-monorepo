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
const ethereumjs_util_1 = require("ethereumjs-util");
const base_1 = require("../../base");
class AccountList extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.requireSynced = false;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.parse(AccountList);
            const celoProvider = this.kit.web3.currentProvider;
            const addresses = yield this.kit.web3.eth.getAccounts();
            const localAddresses = celoProvider.wallet
                .getAccounts()
                .map((value) => ethereumjs_util_1.toChecksumAddress(value));
            let localName = 'Local';
            const res = this.parse();
            if (res.flags.useLedger) {
                localName = 'Ledger';
            }
            console.log('All Addresses: ', addresses);
            console.log('Keystore Addresses: ', addresses.filter((address) => !localAddresses.includes(address)));
            console.log(`${localName} Addresses: `, localAddresses);
        });
    }
}
exports.default = AccountList;
AccountList.description = 'List the addresses from the node and the local instance';
AccountList.flags = Object.assign({}, base_1.BaseCommand.flags);
//# sourceMappingURL=list.js.map