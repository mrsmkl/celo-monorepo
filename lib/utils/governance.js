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
const proposals_1 = require("@celo/contractkit/lib/governance/proposals");
const fs_extra_1 = require("fs-extra");
exports.buildProposalFromJsonFile = (kit, jsonFile) => __awaiter(void 0, void 0, void 0, function* () {
    const builder = new proposals_1.ProposalBuilder(kit);
    const jsonString = fs_extra_1.readFileSync(jsonFile).toString();
    const jsonTransactions = JSON.parse(jsonString);
    jsonTransactions.forEach((tx) => builder.addJsonTx(tx));
    return builder.build();
});
//# sourceMappingURL=governance.js.map