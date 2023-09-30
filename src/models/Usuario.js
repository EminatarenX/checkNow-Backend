import mongoose from 'mongoose'


// se quita el require de nombre y apellidos para que al crear al usuario 
//no tenga que hacer tantos formularios para crear su cuenta'
// y asi tenga una mejor experiencia de usuario
const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,

    },
    apellidos: {
        type: String,

    },
    telefono: {
        type: String,
        length: 10,
        trim: true,
        unique: true,
    },
    direccion: {
        type : String, 
        
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "user", null],
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
    

})

const Usuario = mongoose.model("Usuario", UsuarioSchema, 'usuario')

export default Usuario