import Veterinario from "../models/Veterinario.js";

const registrar = async (req, res) => {

    console.log(req.body);

    const { email} = req.body;

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
        
        res.json(veterinarioGuardado);

    } catch (error) {
        console.error(error);        
    }
};

const perfil = (req, res) => {
    res.send({ msg: "Perfil del Usuario" });
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
        await usuarioConfirmar.save();
        res.json({ msg: 'Usuario confirmado' });
    } catch (error) {
        console.error(error);
    }

    console.log(usuarioConfirmar);

};

export { 
    registrar,
    perfil,
    confirmar
};