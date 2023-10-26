import app from '../index.js'
import request from 'supertest'

describe('Test de inicio de sesion', () => {
    let token;
    
    it('should respond with 400, and return an error', async() => {
        const response = await request(app)
            .post('/api/usuarios/login')
            .set('Content-Type', 'application/json')
            .send({
                correo: 'emi@gmail.com',
                password: '12345'
            });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg')
    })
    it('should respond with 200, and return a token', async() => {
        const response = await request(app)
            .post('/api/usuarios/login')
            .set('Content-Type', 'application/json')
            .send({
                correo: 'emi@correo.com',
                password: '123456'
            });

            token = response.body.token;

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token')
    })
    

    it('should respond with 200 and the user data', async() => {
        const response = await request(app)
            .get('/api/usuarios/perfil')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('usuario')
    })


})

describe('Test de acciones para empresas ( usuarios admin) ', () => {
    let token;

    const numeroRandom = Math.floor(Math.random() * 2000) +1;
    it('should respond with 200, and return a token', async() => {
        const response = await request(app)
            .post('/api/usuarios/login')
            .set('Content-Type', 'application/json')
            .send({
                correo: 'emi@correo.com',
                password: '123456'
            });
        
            token = response.body.token;

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token')
    })

    it('Should respond with 200, and return a bussiness data', async() => {
        const response = await request(app)
            .get('/api/empresas')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('empresa')
    })

    it('Should respond with 201, and return a department data', async() => {
        const response = await request(app)
            .post('/api/departamentos/crear')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Departamento de prueba ' + numeroRandom,
                icon: 'icono de prueba'
            })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('departamento')
    })

    it('should respond with 200 and return a department data with categories if it has', async() => {
        const response = await request(app)
            .get('/api/departamentos/departamento-de-prueba-4')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('departamento')
    })
})