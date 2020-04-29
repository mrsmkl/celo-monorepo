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
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
class ValidatorShow extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args } = this.parse(ValidatorShow);
            const address = args.validatorAddress;
            const validators = yield this.kit.contracts.getValidators();
            yield checks_1.newCheckBuilder(this)
                .isValidator(address)
                .runChecks();
            const validator = yield validators.getValidator(address);
            cli_1.printValueMap(validator);
        });
    }
}
exports.default = ValidatorShow;
ValidatorShow.description = 'Show information about a registered Validator.';
ValidatorShow.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
ValidatorShow.args = [command_1.Args.address('validatorAddress', { description: "Validator's address" })];
ValidatorShow.examples = ['show 0x97f7333c51897469E8D98E7af8653aAb468050a3'];
//# sourceMappingURL=show.js.map