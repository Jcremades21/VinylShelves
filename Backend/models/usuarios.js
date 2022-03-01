const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const UsuarioSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    imagen: {
        type: String
    },
    activo: {
        type: Boolean,
        required: true,
        default: 'true'
    },
    baneado: {
        type: Boolean,
        required: true,
        default: 'false'
    },
    rol: {
        type: String,
        required: true,
        default: 'USUARIO'
    }
}, { collection: 'usuarios' });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);