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
class ReserveStatus extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const reserve = yield this.kit.contracts.getReserve();
            const data = {
                'Reserve address': reserve.address,
                Spenders: yield reserve.getSpenders(),
                'Other reserves': yield reserve.getOtherReserveAddresses(),
                Frozen: yield reserve.frozenReserveGoldStartBalance(),
                'Gold balance': yield reserve.getReserveGoldBalance(),
            };
            cli_1.printValueMapRecursive(data);
        });
    }
}
exports.default = ReserveStatus;
ReserveStatus.description = 'Shows information about reserve';
ReserveStatus.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
ReserveStatus.examples = ['status'];
//# sourceMappingURL=status.js.map