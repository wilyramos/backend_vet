import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";


const veterinarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
        trim: true
    },
    token :{
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    },
});

veterinarioSchema.pre('save', async function (next) {

    if(!this.isModified('password')) {
        next();
    } // Si el password esta hasheado, no lo vuelvas a hashear
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.matchPassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
}; // Metodo para comparar password

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;
