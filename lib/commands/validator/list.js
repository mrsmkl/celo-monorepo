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
const cli_ux_1 = require("cli-ux");
const base_1 = require("../../base");
exports.validatorTable = {
    address: {},
    name: {},
    affiliation: {},
    score: { get: (v) => v.score.toFixed() },
    ecdsaPublicKey: {},
    blsPublicKey: {},
    signer: {},
};
class ValidatorList extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorList);
            cli_ux_1.cli.action.start('Fetching Validators');
            const validators = yield this.kit.contracts.getValidators();
            const validatorList = yield validators.getRegisteredValidators();
            cli_ux_1.cli.action.stop();
            cli_ux_1.cli.table(validatorList, exports.validatorTable, { 'no-truncate': !res.flags.truncate });
        });
    }
}
exports.default = ValidatorList;
ValidatorList.description = 'List registered Validators, their name (if provided), affiliation, uptime score, and public keys used for validating.';
ValidatorList.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
ValidatorList.examples = ['list'];
//# sourceMappingURL=list.js.map