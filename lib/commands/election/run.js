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
function performElections(kit) {
    return __awaiter(this, void 0, void 0, function* () {
        const election = yield kit.contracts.getElection();
        try {
            const signers = yield election.electValidatorSigners();
            return signers;
        }
        catch (err) {
            console.warn('Warning: error running actual elections, retrying with minimum validators at 0');
            return election.electValidatorSigners(0);
        }
    });
}
class ElectionRun extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ElectionRun);
            cli_ux_1.cli.action.start('Running mock election');
            const validators = yield this.kit.contracts.getValidators();
            const signers = yield performElections(this.kit);
            const validatorList = yield Promise.all(signers.map((addr) => validators.getValidatorFromSigner(addr)));
            cli_ux_1.cli.action.stop();
            cli_ux_1.cli.table(validatorList, list_1.validatorTable, { 'no-truncate': !res.flags.truncate });
        });
    }
}
exports.default = ElectionRun;
ElectionRun.description = 'Runs a "mock" election and prints out the validators that would be elected if the epoch ended right now.';
ElectionRun.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
//# sourceMappingURL=run.js.map