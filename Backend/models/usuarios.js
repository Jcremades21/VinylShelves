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
        type: String,
        default: 'https://sicau.pascualbravo.edu.co/SICAU/Sources/fotos/usuario.png'
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
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    favs: [{
        type: String
    }],
    bio: {
        type: String
    },
    list_liked: [{
        type: Schema.Types.ObjectId,
        ref: 'Listal'
    }],
    user_lists: [{
        type: Schema.Types.ObjectId,
        ref: 'Listal'
    }],
    notis: [{
        type: Schema.Types.ObjectId,
        ref: 'Notificacion'
    }],
    notis_act:{
        type: Boolean,
        default: true
    },
    seguidos: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    seguidores: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    


}, { collection: 'usuarios' });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);