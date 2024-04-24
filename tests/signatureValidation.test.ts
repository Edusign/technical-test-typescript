import base64MockedFile from './mocks/base64File.mock';
import request from "supertest";
import app from '../src/app';

describe('Test the signature validation route', () => {
    it('should return an error if there is no signature sended', async () => {
        const response = await request(app).post('/signature/validation')
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: "Invalid file provided" });
    });

    it('should return an error if there is bad parameter sended', async () => {
        const response = await request(app).post('/signature/validation')
            .attach('badParameter', Buffer.from(base64MockedFile, 'base64'));
        expect(response.statusCode).toBe(400);
    });

    it('should return an error if the signature is not validated', async () => {
        const response = await request(app).post('/signature/validation')
            .attach('signature', Buffer.from(base64MockedFile, 'base64'), 'signature.png')
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: "Invalid file provided" });
    });

    it('should return a success if the signature is validated', async () => {
        const response = await request(app).post('/signature/validation')
            .attach('signature', Buffer.from(base64MockedFile, 'base64'), 'signature.png')
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Valid signature" });
    });
});