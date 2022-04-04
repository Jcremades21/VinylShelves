const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const HiloSchema = Schema({
    comentarios: [ {
        type: String
    }
    ],
    activadas: {
        type: Boolean,
        default: false,
    }
}, { collection: 'hilos' });

HiloSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Hilo', HiloSchema);