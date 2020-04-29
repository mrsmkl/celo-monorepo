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
class ValidatorRequirements extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.parse(ValidatorRequirements);
            const validators = yield this.kit.contracts.getValidators();
            const requirements = yield validators.getValidatorLockedGoldRequirements();
            cli_1.printValueMap(requirements);
        });
    }
}
exports.default = ValidatorRequirements;
ValidatorRequirements.description = 'List the Locked Gold requirements for registering a Validator. This consists of a value, which is the amount of Celo Gold that needs to be locked in order to register, and a duration, which is the amount of time that Gold must stay locked following the deregistration of the Validator.';
ValidatorRequirements.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
ValidatorRequirements.examples = ['requirements'];
//# sourceMappingURL=requirements.js.map