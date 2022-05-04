const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const ReporteComentarioSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    usuario_reportado: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    comentario: {
        type: Schema.Types.ObjectId,
        ref: 'Comentario',
        required: true
    },
    motivo: {
        type: String,
        required: true
    },
    texto: {
        type: String,
    }
}, { collection: 'reportescomentarios' });

ReporteComentarioSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('ReporteComentario', ReporteComentarioSchema);