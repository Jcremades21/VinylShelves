const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const RatingSchema = Schema({
    estrellas: {
        type: Number,
        required: true,
    },
    album: {
        type: String,
        required: true
    },
    albumid: {
        type: String
    },
    albumimg: {
        type: String
    },
    albumart: {
        type: String
    },
    albumtit: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, { collection: 'ratings' });

RatingSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Rating', RatingSchema);