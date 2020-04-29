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
const config_1 = require("../../utils/config");
class Get extends base_1.LocalCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            cli_1.printValueMap(config_1.readConfig(this.config.configDir));
        });
    }
}
exports.default = Get;
Get.description = 'Output network node configuration';
Get.flags = Object.assign({}, base_1.LocalCommand.flags);
//# sourceMappingURL=get.js.map