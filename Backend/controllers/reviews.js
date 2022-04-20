const Review = require('../models/reviews');
const validator = require('validator');
const { validationResult } = require('express-validator');
const { infoToken } = require('../helpers/infotoken');

const obtenerReviews = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    const album = req.query.album;
    const artista = req.query.artist;
    const pag = req.query.pag;
    let textoBusqueda = '';
    let albumBusqueda = '';
    let artistBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        // console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    if (album) {
        albumBusqueda = new RegExp(album, 'i');
        // console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    if (artista) {
        artistBusqueda = new RegExp(artista, 'i');
        // console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || '';

    //await sleep(1000);
    try {

        // Solo puede listar usuarios un admin

        let reviews, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {
            if (!validator.isMongoId(id)) {
                return res.json({
                    ok: false,
                    msg: 'El id de la review debe ser válido'
                });
            }
            [reviews, total] = await Promise.all([
                Review.findById(id).populate('album', '-__v').populate('usuario', '-__v').populate('comentarios', '-__v'),
                Review.countDocuments()
            ]);

        }
         else {
    
            let query = new Object();
    
            if (texto) query.titulo = textoBusqueda;
    
            if (album) query.album = albumBusqueda;;
    
            if (artista) query.artista = artistBusqueda;
        
            console.log(query);
    
            if (pag == 0) {
                [reviews, total] = await Promise.all([
                    Review.find({ $or: [query] }).skip(desde).populate('comentarios', '-__v').populate('usuario', '-__v').populate('likes', '-__v'),
                    Review.countDocuments({ $or: [query] })
                ]);
            } else {
                [reviews, total] = await Promise.all([
                    Review.find({ $or: [query] }).skip(desde).limit(registropp).populate('comentarios', '-__v').populate('usuario', '-__v').populate('likes', '-__v'),
                    Review.countDocuments({ $or: [query] })
                ]);
            }
    
        }

        res.json({
            ok: true,
            msg: 'getReviews',
            reviews,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniedo reviews'
        });
    }
}

const crearReview = async(req, res) => {

    const review = new Review(req.body);
    await review.save();
    res.json({
        ok: true,
        msg: 'crearReview',
        review
    });
}


const actualizarReview = async(req, res) => {
    const uid = req.params.id;
    const object = req.body;

    try { //de momento actualiza buscando por nombre, está mal ya que el nombre no es único para los eventos

        const evento = await Review.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Review actualizado',
            evento
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando review'
        });
    }

}

const borrarReview = async(req, res) => {

    const uid = req.params.id;

    try { //de momento borra buscando por nombre, está mal ya que el nombre no es único para los eventos
        const existeuid = await Review.findById(uid);
        if (!existeuid) {
            return res.status(400).json({
                ok: false,
                msg: 'La review no existe'
            });
        }
        const resultado = await Review.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'borradoReview',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando review'
        });
    }

}

module.exports = { obtenerReviews, crearReview, actualizarReview, borrarReview }