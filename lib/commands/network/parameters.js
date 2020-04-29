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
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
class Parameters extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.kit.getNetworkConfig();
            cli_1.printValueMapRecursive(config);
        });
    }
}
exports.default = Parameters;
Parameters.description = 'View parameters of the network, including but not limited to configuration for the various Celo core smart contracts.';
Parameters.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
//# sourceMappingURL=parameters.js.map