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
class ValidatorGroupShow extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorGroupShow);
            const validators = yield this.kit.contracts.getValidators();
            yield checks_1.newCheckBuilder(this)
                .isValidatorGroup(res.args.groupAddress)
                .runChecks();
            const validatorGroup = yield validators.getValidatorGroup(res.args.groupAddress);
            cli_1.printValueMap(validatorGroup);
        });
    }
}
exports.default = ValidatorGroupShow;
ValidatorGroupShow.description = 'Show information about an existing Validator Group';
ValidatorGroupShow.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
ValidatorGroupShow.args = [command_1.Args.address('groupAddress', { description: "ValidatorGroup's address" })];
ValidatorGroupShow.examples = ['show 0x97f7333c51897469E8D98E7af8653aAb468050a3'];
//# sourceMappingURL=show.js.map