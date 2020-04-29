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
const command_1 = require("@oclif/command");
const base_1 = require("../../base");
const config_1 = require("../../utils/config");
class Set extends base_1.LocalCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Set);
            const config = {
                nodeUrl: res.flags.node,
            };
            yield config_1.writeConfig(this.config.configDir, config);
        });
    }
}
exports.default = Set;
Set.description = 'Configure running node information for propogating transactions to network';
Set.flags = Object.assign(Object.assign({}, base_1.LocalCommand.flags), { 
    // Overrides base command node flag.
    node: command_1.flags.string({
        char: 'n',
        required: true,
        description: 'URL of the node to run commands against',
        default: 'http://localhost:8545',
    }) });
Set.examples = ['set  --node ws://localhost:2500', 'set  --node <geth-location>/geth.ipc'];
//# sourceMappingURL=set.js.map