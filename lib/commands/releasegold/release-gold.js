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
const ReleaseGold_1 = require("@celo/contractkit/lib/generated/ReleaseGold");
const ReleaseGold_2 = require("@celo/contractkit/lib/wrappers/ReleaseGold");
const base_1 = require("../../base");
const command_1 = require("../../utils/command");
class ReleaseGoldCommand extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this._contractAddress = null;
        this._releaseGoldWrapper = null;
    }
    get contractAddress() {
        if (!this._contractAddress) {
            const res = this.parse();
            this._contractAddress = String(res.flags.contract);
        }
        return this._contractAddress;
    }
    get releaseGoldWrapper() {
        if (!this._releaseGoldWrapper) {
            this.error('Error in initilizing release gold wrapper');
        }
        return this._releaseGoldWrapper;
    }
    init() {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this);
            if (!this._releaseGoldWrapper) {
                this._releaseGoldWrapper = new ReleaseGold_2.ReleaseGoldWrapper(this.kit, ReleaseGold_1.newReleaseGold(this.kit.web3, this.contractAddress));
                // Call arbitrary release gold fn to verify `contractAddress` is a releasegold contract.
                try {
                    yield this._releaseGoldWrapper.getBeneficiary();
                }
                catch (err) {
                    this.error(`Does the provided address point to release gold contract? ${err}`);
                }
            }
        });
    }
}
exports.ReleaseGoldCommand = ReleaseGoldCommand;
ReleaseGoldCommand.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { contract: command_1.Flags.address({ required: true, description: 'Address of the ReleaseGold Contract' }) });
//# sourceMappingURL=release-gold.js.map