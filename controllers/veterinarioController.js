import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {

    console.log(req.body);

    const { email, nombre} = req.body;

    // revisar si el email ya esta registrado
    const existeUsuario = await Veterinario.findOne({
        email
    });

    if (existeUsuario) {
        const error = new Error('El email ya esta registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // save new veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // enviar email de confirmacion

        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });
        
        res.json(veterinarioGuardado);

    } catch (error) {
        console.error(error);        
    }
};

const confirmar = async (req, res) => {

    const { token } = req.params;
    const usuarioConfirmar = await Veterinario.findOne({
        token
    });

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        console.log('confirmar cuenta paso');
        await usuarioConfirmar.save();
        res.json({ msg: 'Usuario confirmado' });
    } catch (error) {
        console.error(error);
    }
    console.log('confirmar cuenta paso');
    console.log(usuarioConfirmar);

};

const autenticar = async (req, res) => {
    
    const { email, password } = req.body;

    const usuario = await Veterinario.findOne({
        email
    });

    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    if (!usuario.confirmado) {
        const error = new Error('El usuario no esta confirmado');
        return res.status(400).json({ msg: error.message });
    }

    if(!(await usuario.matchPassword(password))) {
        const error = new Error('Password incorrecto');
        return res.status(400).json({ msg: error.message });
    }
    // Generar JWT 
    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario._id)
    });
}; 

const olvidePassword = async (req, res) => {
    
    const { email } = req.body;
    const exiteVeterinario = await Veterinario.findOne({
        email
    });

    

    if (!exiteVeterinario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        exiteVeterinario.token = generarId();
        await exiteVeterinario.save();

        // enviar email para reestablecer la contraseña

        emailOlvidePassword({
            email,
            nombre: exiteVeterinario.nombre,
            token: exiteVeterinario.token
        });

        res.json({ msg: 'Se envio un email para reestablecer la contraseña' });
    } catch (error) {
        console.error(error);
    }



};

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Veterinario.findOne({
        token
    });

    if (tokenValido) {
        res.json({ msg: 'Token valido' });
    }
    else {
        const error = new Error('Token invalido');
        return res.status(400).json({ msg: error.message });
    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({
        token
    });

    if(!veterinario) {
        const error = new Error('Token invalido');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.password = password;
        veterinario.token = null;
        await veterinario.save();
        res.json({ msg: 'Password actualizado' });
    } catch (error) {
        console.error(error);
    }
};

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario ); 
};

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    
    if(!veterinario) {
        const error = new Error('Veterinario no encontrado');
        return res.status(400).json({ msg: error.message });
    }

    if(veterinario.email !== req.body.email) {
        const existeVeterinario = await Veterinario.findOne({
            email: req.body.email
        });

        if (existeVeterinario) {
            const error = new Error('El email ya esta registrado');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.sitioWeb = req.body.sitioWeb;
        veterinario.telefono = req.body.telefono;
        veterinario.email = req.body.email;

        
        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);

    } catch (error) {
        console.error(error);
    }

}

const actualizarPassword = async (req, res) => { 
    // leer los datos
    const { id } = req.veterinario;
    const { password, newPassword } = req.body;

    // comporbar que existe el veterinario

    const veterinario = await Veterinario.findById(id);
    if(!veterinario) {
        const error = new Error('Veterinario no encontrado');
        return res.status(400).json({ msg: error.message });
    }

    // comporbar el password
    if(await veterinario.matchPassword(password)) {

        // almacenar el nuevo password
        veterinario.password = newPassword;
        await veterinario.save();
        res.json({ msg: 'Password actualizado' });
        
    } else {
        const error = new Error('Password actual incorrecto');
        return res.status(400).json({ msg: error.message });
    }


}


export { 
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};