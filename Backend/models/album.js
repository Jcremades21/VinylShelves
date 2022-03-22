const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const AlbumSchema = Schema({
    id: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    artista: {
        type: String,
        required: true,
    },
    imagen: {
        type: String
    },
    fechasalida: {
        type: Date
    },
    label: {
        type: String
    },
    tracks:[ {
        type: String
    }],
    links:[ {
        type: String
    }],
    genero: {
        type: String
    },
    selection: {
        type: Boolean,
        default: false
    }
}, { collection: 'albumes' });

AlbumSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Album', AlbumSchema);