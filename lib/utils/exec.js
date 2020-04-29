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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const command_exists_1 = __importDefault(require("command-exists"));
function execCmd(cmd, args, options) {
    return new Promise((resolve, reject) => {
        const _a = options || { silent: false }, { silent } = _a, spawnOptions = __rest(_a, ["silent"]);
        if (!silent) {
            console.debug('$ ' + [cmd].concat(args).join(' '));
        }
        const process = child_process_1.spawn(cmd, args, Object.assign(Object.assign({}, spawnOptions), { stdio: silent ? 'ignore' : 'inherit' }));
        process.on('close', (code) => {
            try {
                resolve(code);
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.execCmd = execCmd;
function execWith0Exit(cmd, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return (yield execCmd(cmd, args, options)) === 0;
        }
        catch (error) {
            return false;
        }
    });
}
exports.execWith0Exit = execWith0Exit;
function execCmdWithError(cmd, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = yield execCmd(cmd, args, options);
        if (code !== 0) {
            throw new Error(`"${cmd} ${args.join(' ')}" exited ${code}`);
        }
    });
}
exports.execCmdWithError = execCmdWithError;
function commandExists(command) {
    return __awaiter(this, void 0, void 0, function* () {
        return command_exists_1.default(command);
    });
}
exports.commandExists = commandExists;
//# sourceMappingURL=exec.js.map