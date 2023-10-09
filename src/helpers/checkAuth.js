import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

async function checkAuth(req, res, next) {
    let token;

   try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]

        const {id} = await jwt.verify(token, process.env.JWT_SECRET)

        let usuario = await Usuario.findById(id)

        if(!usuario) {
            return res.status(401).json({msg: "No autorizado"})
        }

        req.usuario = usuario
        
        return next()

    }else {
        return res.status(401).json({msg: "No autorizado"})
    }
    
   } catch (error) {

    console.log(error)
        return res.status(401).json({msg: "No autorizado"})
   }
}

export { checkAuth }