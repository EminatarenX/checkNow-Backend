import nodemailer from 'nodemailer'
import fs from 'fs'

const emailRegistro = async(datos) => {

    const { correo, token} = datos

    try{

    const transport = nodemailer.createTransport({
        // host: "sandbox.smtp.mailtrap.io",
        // post: "2525",
        // auth: {
        //     user: "5c73a16264e257",
        //     pass: "b0b35da0d73cce"
        //   }
            service: "gmail",
            auth: {
              user: "checknowbussiness@gmail.com",
              pass: "wghmkyxynawsyxaw"
            }
    })

    const info = await transport.sendMail({
        from: '"Check-Now - Administra tu "negocio" <no-reply@checknow.com>',
        to: correo,
        subject: "Check-Now confirma tu cuenta",
        text: "Bienvenido a Check-Now",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }
        
                .main {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    justify-content: center;
                    background-color: #07BD1B;
                    padding: 1.25rem;
                }
        
                .card {
                    background-color: white;
                    border-radius: 0.75rem;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    animation: fade 0.5s ease ;
                }
        
                h1 {
                    font-size: 2.5rem;
                    font-weight: bold;
                }
        
                p {
                    font-size: 1.25rem;
                    color: #4A5568;
                    margin: 0.625rem 0;
                }
        
                .btn {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    background-color: #07BD1B;
                    color: white;
                    text-decoration: none;
                    border-radius: 0.25rem;
                    font-size: 1.25rem;
                    margin-top: 1.25rem;
                    transition: all 0.4s ease;
                }
        
                .btn:hover {
                    background-color: #12EE2A;
                    scale: 1.1;
                }
        
                .text-muted {
                    color: #718096;
                }

                @keyframes fade {
                    from {
                        opacity: 0;
                        transform: translateY(1rem);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>
        
            <main class="main">
                <div class="card">
                    <h1>Check-Now</h1>
                    <p>¡Hola!, bienvenido a Check-Now.</p>
                    <p>Confirma tu cuenta haciendo clic en el siguiente enlace:</p>
                    <a href="${process.env.FRONTEND_URL}/confirmar/${token}" class="btn">Comprobar cuenta</a>
        
                    <p class="text-muted">Si no reconoces esta operación, ignora este mensaje.</p>
                </div>
            </main>
        </body>
        </html>
        `
    })
    }catch(error){
    console.log(error)
    }
}

const emailCambiarPassword = async(datos) => {
    
        const { correo, token} = datos

        try{

        const transport = nodemailer.createTransport({
            // host: "sandbox.smtp.mailtrap.io",
            // post: "2525",
            // auth: {
            //     user: "5c73a16264e257",
            //     pass: "b0b35da0d73cce"
            // }
    
            service: "gmail",
            auth: {
              user: "checknowbussiness@gmail.com",
              pass: "wghmkyxynawsyxaw"
            }
        })

        const info = await transport.sendMail({
            from: '"Check-now - Administra tu negocio" <no-reply@checknow.com>',
            to: correo,
            subject: "Check-Now Cambia tu contraseña",
            text: "Bienvenido a Check-Now",
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <style>

                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                    }

                    .main {
                        display: flex;
                        flex-direction: column;
                        gap: 1.25rem;
                        justify-content: center;
                        background-color: #07BD1B;
                        padding: 1.25rem;
                    }

                    .card {
                        background-color: white;
                        border-radius: 0.75rem;
                        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                        padding: 1.25rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        animation: fade 0.5s ease ;
                    }
            
                    h1 {
                        font-size: 2.5rem;
                        font-weight: bold;
                    }
            
                    p {
                        font-size: 1.25rem;
                        color: #4A5568;
                        margin: 0.625rem 0;
                    }
            
                    .btn {
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        background-color: #07BD1B;
                        color: white;
                        text-decoration: none;
                        border-radius: 0.25rem;
                        font-size: 1.25rem;
                        margin-top: 1.25rem;
                        transition: all 0.4s ease;
                    }
            
                    .btn:hover {
                        background-color: #12EE2A;
                        scale: 1.1;
                    }
            
                    .text-muted {
                        color: #718096;
                    }
    
                    @keyframes fade {
                        from {
                            opacity: 0;
                            transform: translateY(1rem);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                </style>
            
                <main class="main">
                    <div class="card">
                        <h1>Check-Now</h1>
                        <p>Restablecer contraseña Check-Now.</p>
                        <p>Haz clic en el siguiente enlace para cambiar la contraseña:</p>
                        <a href="${process.env.FRONTEND_URL}/recovery/${token}" class="btn">Cambiar contraseña</a>
            
                        <p class="text-muted">Si no reconoces esta operacion, ignora este mensaje.</p>
                    </div>
                </main>
            </body>
            </html>
            `
        })
    }catch(error){
        console.log(error)
    }
}

const enviarNominaTrabajador = async( datos ) => {
    const { correo, url, usuario } = datos

    try {
        const transport = nodemailer.createTransport({
            // host: "sandbox.smtp.mailtrap.io",
            // post: "2525",
            // auth: {
            //     user: "5c73a16264e257",
            //     pass: "b0b35da0d73cce"
            // }
    
            service: "gmail",
            auth: {
              user: "checknowbussiness@gmail.com",
              pass: "wghmkyxynawsyxaw"
            }
        })

        const response = await fetch(url)
        const responseBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(responseBuffer)
    

        const info = await transport.sendMail({
            from: '"Check-now - Administra tu negocio" <no-reply@checknow.com>',
            to: correo,
            subject: "Recibo de nomina",
            attachments: [
                {
                    filename: `${usuario.nombre}-${usuario.apellidos}-${Date.now().toString().split('T')[0]}.pdf`,
                    content: buffer,
                }
            ]
        })

        return info
        
    } catch (error) {
        console.log(error)
       
    }
}

export {
    emailRegistro,
    emailCambiarPassword,
    enviarNominaTrabajador
}

