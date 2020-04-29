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
const list_1 = require("../validator/list");
class ElectionCurrent extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ElectionCurrent);
            cli_ux_1.cli.action.start('Fetching currently elected Validators');
            const election = yield this.kit.contracts.getElection();
            const validators = yield this.kit.contracts.getValidators();
            const signers = yield election.getCurrentValidatorSigners();
            const validatorList = yield Promise.all(signers.map((addr) => validators.getValidatorFromSigner(addr)));
            cli_ux_1.cli.action.stop();
            cli_ux_1.cli.table(validatorList, list_1.validatorTable, { 'no-truncate': !res.flags.truncate });
        });
    }
}
exports.default = ElectionCurrent;
ElectionCurrent.description = 'Outputs the set of validators currently participating in BFT to create blocks. An election is run to select the validator set at the end of every epoch.';
ElectionCurrent.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
//# sourceMappingURL=current.js.map