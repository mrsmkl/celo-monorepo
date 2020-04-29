"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("@celo/utils/lib/address");
const base_1 = require("../../base");
const command_1 = require("../../utils/command");
class IsValidator extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args } = this.parse(IsValidator);
            const election = yield this.kit.contracts.getElection();
            const numberValidators = yield election.numberValidatorsInCurrentSet();
            for (let i = 0; i < numberValidators; i++) {
                const validatorAddress = yield election.validatorAddressFromCurrentSet(i);
                if (address_1.eqAddress(validatorAddress, args.address)) {
                    console.log(`${args.address} is in the current validator set`);
                    return;
                }
            }
            console.log(`${args.address} is not currently in the validator set`);
        });
    }
}
IsValidator.description = 'Check whether a given address is elected to be validating in the current epoch';
IsValidator.flags = Object.assign({}, base_1.BaseCommand.flags);
IsValidator.args = [command_1.Args.address('address')];
IsValidator.examples = ['isvalidator 0x5409ed021d9299bf6814279a6a1411a7e866a631'];
exports.default = IsValidator;
//# sourceMappingURL=isvalidator.js.map