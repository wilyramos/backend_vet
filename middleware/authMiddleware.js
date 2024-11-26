import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {

    let token;

    if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');
            // console.log(req.veterinario);
            return next();
        } catch (error) {
            res.status(401).json({ msg: 'Token invalido' });
        }
    }
    if(!token) {
        res.status(401).json({ msg: 'No autorizado, no hay token' });
    }

    next();
};

export default checkAuth;