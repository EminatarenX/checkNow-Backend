import app from '../index.js'
import request from 'supertest'

describe('Test de inicio de sesion', () => {
    it('should respond with 200, and return a token', async() => {
        const response = await request(app)
            .post('/api/usuarios/login')
            .set('Content-Type', 'application/json')
            .send({
                correo: 'emi@correo.com',
                password: '123456'
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token')
    })
    
    it('should respond with 400, and return an error', async() => {
        const response = await request(app)
            .post('/api/usuarios/login')
            .set('Content-Type', 'application/json')
            .send({
                correo: 'emi@gmail.com',
                password: '123456'
            });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg')
    })


})