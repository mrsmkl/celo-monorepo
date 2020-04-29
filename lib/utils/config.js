"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:class-name max-classes-per-file
// TODO: investigate tslint issues
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
exports.localGeth = {
    nodeUrl: 'http://localhost:8545',
};
const configFile = 'config.json';
function configPath(configDir) {
    return path.join(configDir, configFile);
}
exports.configPath = configPath;
function readConfig(configDir) {
    if (fs.pathExistsSync(configPath(configDir))) {
        return fs.readJSONSync(configPath(configDir));
    }
    else {
        return exports.localGeth;
    }
}
exports.readConfig = readConfig;
function getNodeUrl(configDir) {
    return readConfig(configDir).nodeUrl;
}
exports.getNodeUrl = getNodeUrl;
function writeConfig(configDir, configObj) {
    fs.outputJSONSync(configPath(configDir), configObj);
}
exports.writeConfig = writeConfig;
//# sourceMappingURL=config.js.map