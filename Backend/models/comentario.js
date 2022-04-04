const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const ComentarioSchema = Schema({
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    texto: {
        type: String,
        required: true
    }
}, { collection: 'comentarios' });

ComentarioSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Comentario', ComentarioSchema);