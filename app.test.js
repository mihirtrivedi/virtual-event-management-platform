import request from 'supertest';
import app from './src/app.js'; // Ensure path to app.js is correct

describe('Initial Test', () => {
    test('Should run a sample test', () => {
        expect(1 + 1).toBe(2);
    });
});
