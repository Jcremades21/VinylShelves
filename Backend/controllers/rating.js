const Rating = require('../models/rating');
const validator = require('validator');
const { validationResult } = require('express-validator');
const { infoToken } = require('../helpers/infotoken');

const obtenerRatings = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const usu = req.query.usu;
    const pag = req.query.pag;
    let textoBusqueda = '';
    if (usu) {
        textoBusqueda = new RegExp(usu, 'i');
        // console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || '';

    //await sleep(1000);
    try {

        // Solo puede listar usuarios un admin

        let ratings, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [ratings, total] = await Promise.all([
                Rating.findById(id).populate('usuario', '-__v'),
                Rating.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            if (usu) {
                if(pag){
                [ratings, total] = await Promise.all([
                    Rating.find({ $or: [{ usuario: textoBusqueda }] }).skip(desde).populate('usuario', '-__v'),
                    Rating.countDocuments({ $or: [{ usuario: textoBusqueda}] })
                ]);
                }
                else{
                [ratings, total] = await Promise.all([
                    Rating.find({ $or: [{ usuario: textoBusqueda }] }).skip(desde).limit(registropp).populate('usuario', '-__v'),
                    Rating.countDocuments({ $or: [{ usuario: textoBusqueda}] })
                ]);
                }
            } else {
                if(pag){
                [ratings, total] = await Promise.all([
                    Rating.find({}).skip(desde).populate('usuario', '-__v'),
                    Rating.countDocuments()
                ]);
                }
                else{
                [ratings, total] = await Promise.all([
                    Rating.find({}).skip(desde).limit(registropp).populate('usuario', '-__v'),
                    Rating.countDocuments()
                ]); 
                }
            }

        }

        res.json({
            ok: true,
            msg: 'getRatings',
            ratings,
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
            msg: 'Error obteniedo ratings'
        });
    }
}

const crearRatings = async(req, res) => {

    const rat = new Rating(req.body);
    await rat.save();
    res.json({
        ok: true,
        msg: 'crearRating',
        rat
    });
}

const actualizarRatings = async(req, res) => {
    const uid = req.params.id;
    const object = req.body;

    try { //de momento actualiza buscando por nombre, está mal ya que el nombre no es único para los eventos

        const rat = await Rating.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Rating actualizada',
            rat
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando review'
        });
    }

}

const borrarRatings = async(req, res) => {

    const uid = req.params.id;

    try {
        // Solo puede borrar usuarios un admin
        const token = req.header('x-token');

        if (!(infoToken(token).rol === 'ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para borrar usuarios',
            });
        }

        // Comprobamos si existe el usuario que queremos borrar
        const existeAlbumes = await Rating.findById(uid);
        if (!existeAlbumes) {
            return res.status(400).json({
                ok: true,
                msg: 'El rating no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Rating.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Rating eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando rating'
        });
    }

}


module.exports = { obtenerRatings, crearRatings, actualizarRatings, borrarRatings }