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
const lib_1 = require("@celo/contractkit/lib");
const proxy_1 = require("@celo/contractkit/lib/governance/proxy");
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
class Contracts extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const lst = [
                lib_1.CeloContract.Accounts,
                lib_1.CeloContract.Attestations,
                lib_1.CeloContract.BlockchainParameters,
                lib_1.CeloContract.DoubleSigningSlasher,
                lib_1.CeloContract.DowntimeSlasher,
                lib_1.CeloContract.Election,
                lib_1.CeloContract.EpochRewards,
                lib_1.CeloContract.Escrow,
                lib_1.CeloContract.Exchange,
                lib_1.CeloContract.FeeCurrencyWhitelist,
                lib_1.CeloContract.Freezer,
                lib_1.CeloContract.GasPriceMinimum,
                lib_1.CeloContract.GoldToken,
                lib_1.CeloContract.Governance,
                lib_1.CeloContract.LockedGold,
                lib_1.CeloContract.Random,
                lib_1.CeloContract.Registry,
                lib_1.CeloContract.Reserve,
                lib_1.CeloContract.SortedOracles,
                lib_1.CeloContract.StableToken,
                lib_1.CeloContract.TransferWhitelist,
                lib_1.CeloContract.Validators,
            ];
            const res = yield Promise.all(lst.map((name) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const contract = yield this.kit._web3Contracts.getContract(name);
                    const proxy = new this.kit.web3.eth.Contract(proxy_1.PROXY_ABI);
                    proxy.options.address = contract.options.address;
                    return {
                        name,
                        contract: contract.options.address +
                            ' (implementation at ' +
                            (yield proxy.methods._getImplementation().call()) +
                            ')',
                    };
                }
                catch (err) {
                    console.log(err);
                    return { name, contract: lib_1.NULL_ADDRESS };
                }
            })));
            const obj = {};
            for (const { name, contract } of res) {
                obj[name] = contract;
            }
            cli_1.printValueMapRecursive(obj);
        });
    }
}
exports.default = Contracts;
Contracts.description = 'Prints Celo contract addesses.';
Contracts.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
//# sourceMappingURL=contracts.js.map