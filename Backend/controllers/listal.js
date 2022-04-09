const Lista = require('../models/listal');
const validator = require('validator');
const { validationResult } = require('express-validator');
const { infoToken } = require('../helpers/infotoken');

const obtenerListas = async(req, res) => {

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
    if (album) {
        albumBusqueda = new RegExp(album, 'i');
        // console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || '';

    //await sleep(1000);
    try {

        // Solo puede listar usuarios un admin

        let listas, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [listas, total] = await Promise.all([
                Lista.findById(id).populate('usuario', '-__v').populate('comentarios', '-__v').populate('array', '-__v'),
                Lista.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            if (texto) {
                [listas, total] = await Promise.all([
                    Lista.find({ $or: [{ titulo: textoBusqueda }] }).skip(desde).populate('array', '-__v').populate('usuario', '-__v').populate('comentarios', '-__v'),
                    Lista.countDocuments({ $or: [{ titulo: textoBusqueda}] })
                ]);
            } 
            else {
                [listas, total] = await Promise.all([
                    Lista.find({}).skip(desde).populate('usuario', '-__v').populate('comentarios', '-__v').populate('array', '-__v'),
                    Lista.countDocuments()
                ]);
            }

        }

        res.json({
            ok: true,
            msg: 'getListas',
            listas,
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
            msg: 'Error obteniedo listas'
        });
    }
}

const crearLista = async(req, res) => {

    const lista = new Lista(req.body);
    await lista.save();
    res.json({
        ok: true,
        msg: 'crearLista',
        lista
    });
}


const actualizarLista = async(req, res) => {
    const uid = req.params.id;
    const object = req.body;

    try { //de momento actualiza buscando por nombre, está mal ya que el nombre no es único para los eventos

        const lista = await Lista.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Lista actualizada',
            lista
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando lista'
        });
    }

}

const borrarLista = async(req, res) => {

    const uid = req.params.id;

    try { //de momento borra buscando por nombre, está mal ya que el nombre no es único para los eventos
        const existeuid = await Lista.findById(uid);
        if (!existeuid) {
            return res.status(400).json({
                ok: false,
                msg: 'La lista no existe'
            });
        }
        const resultado = await Lista.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'borradoLista',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando lista'
        });
    }

}

module.exports = { obtenerListas, crearLista, actualizarLista, borrarLista }