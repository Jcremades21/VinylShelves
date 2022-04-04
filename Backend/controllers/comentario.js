const Comentario = require('../models/comentario');
const validator = require('validator');
const { validationResult } = require('express-validator');
const { infoToken } = require('../helpers/infotoken');

const obtenerComentario = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    const album = req.query.album;
    let textoBusqueda = '';
    let albumBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        // console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || '';

    //await sleep(1000);
    try {

        // Solo puede listar usuarios un admin

        let comentarios, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [comentarios, total] = await Promise.all([
                Comentario.findById(id).populate('creador', '-__v'),
                Comentario.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            if (texto) {
                [comentarios, total] = await Promise.all([
                    Comentario.find({ $or: [{ texto: textoBusqueda }] }).skip(desde).limit(registropp).populate('creador', '-__v'),
                    Comentario.countDocuments({ $or: [{ texto: textoBusqueda}] })
                ]);
            } 

            else {
                [comentarios, total] = await Promise.all([
                    Comentario.find({}).skip(desde).limit(registropp).populate('creador', '-__v'),
                    Comentario.countDocuments()
                ]);
            }

        }

        res.json({
            ok: true,
            msg: 'getComentarios',
            comentarios,
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
            msg: 'Error obteniedo comentarios'
        });
    }
}

const crearComentario = async(req, res) => {

    const comentario = new Comentario(req.body);
    await comentario.save();
    res.json({
        ok: true,
        msg: 'crearComentario',
        comentario
    });
}


const actualizarComentario = async(req, res) => {
    const uid = req.params.id;
    const object = req.body;

    try { //de momento actualiza buscando por nombre, está mal ya que el nombre no es único para los eventos

        const evento = await Comentario.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Comentario actualizado',
            evento
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando comentario'
        });
    }

}

const borrarComentario = async(req, res) => {

    const uid = req.params.id;

    try { //de momento borra buscando por nombre, está mal ya que el nombre no es único para los eventos
        const existeuid = await Comentario.findById(uid);
        if (!existeuid) {
            return res.status(400).json({
                ok: false,
                msg: 'El comentario no existe'
            });
        }
        const resultado = await Comentario.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'borradoComent',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando comentario'
        });
    }

}

module.exports = { obtenerComentario, crearComentario, actualizarComentario, borrarComentario }