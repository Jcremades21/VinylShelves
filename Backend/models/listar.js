const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const ListarSchema = Schema({
    titulo: {
        type: String,
        required: true,
    },
    array:  [{
        type: Schema.Types.ObjectId,
        ref: 'Artista'
    }],
    comentarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Comentario'
    }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    likes:[ {
        type: String
    }],
    descripcion: {
        type: String
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, { collection: 'listar' });

ListarSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Listar', ListarSchema);