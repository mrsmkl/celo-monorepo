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
class ValidatorGroupList extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ValidatorGroupList);
            cli_ux_1.cli.action.start('Fetching Validator Groups');
            const validators = yield this.kit.contracts.getValidators();
            const vgroups = yield validators.getRegisteredValidatorGroups();
            cli_ux_1.cli.action.stop();
            cli_ux_1.cli.table(vgroups, {
                address: {},
                name: {},
                commission: { get: (r) => r.commission.toFixed() },
                members: { get: (r) => r.members.length },
            }, { 'no-truncate': !res.flags.truncate });
        });
    }
}
exports.default = ValidatorGroupList;
ValidatorGroupList.description = 'List registered Validator Groups, their names (if provided), commission, and members.';
ValidatorGroupList.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
ValidatorGroupList.examples = ['list'];
//# sourceMappingURL=list.js.map