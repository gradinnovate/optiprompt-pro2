"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
describe('Hello World API', () => {
    const BACKEND_URL = 'http://localhost:3000/api/helloworld';
    it('should return hello world message', async () => {
        const response = await axios_1.default.get(BACKEND_URL);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('message', 'Hello World!');
        expect(response.data).toHaveProperty('timestamp');
        expect(response.data).toHaveProperty('environment');
    });
});
