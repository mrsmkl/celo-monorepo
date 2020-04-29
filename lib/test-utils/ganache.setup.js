"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ganache_setup_1 = __importDefault(require("@celo/dev-utils/lib/ganache-setup"));
const path = __importStar(require("path"));
function setup() {
    return ganache_setup_1.default(path.resolve(path.join(__dirname, '../../')), '.tmp/devchain.tar.gz', {
        from_targz: true,
    });
}
exports.default = setup;
//# sourceMappingURL=ganache.setup.js.map