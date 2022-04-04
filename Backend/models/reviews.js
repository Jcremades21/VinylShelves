const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const ReviewSchema = Schema({
    titulo: {
        type: String,
        required: true,
    },
    texto: {
        type: String,
        required: true,
    },
    artista: {
        type: String,
        required: true
    },
    comentarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Comentario'
    }],
    album: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    likes:[ {
        type: String
    }],
    fecha: {
        type: Date,
        default: Date.now
    }
}, { collection: 'reviews' });

ReviewSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Review', ReviewSchema);