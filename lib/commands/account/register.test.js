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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ganache_test_1 = require("@celo/dev-utils/lib/ganache-test");
const register_1 = __importDefault(require("./register"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('account:register cmd', (web3) => {
    test('can register account', () => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield web3.eth.getAccounts();
        yield register_1.default.run(['--from', accounts[0], '--name', 'Chapulin Colorado']);
    }));
    test('fails if from is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        // const accounts = await web3.eth.getAccounts()
        yield expect(register_1.default.run([])).rejects.toThrow('Missing required flag');
    }));
});
//# sourceMappingURL=register.test.js.map