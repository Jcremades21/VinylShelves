const Hilo = require('../models/hilo');
const validator = require('validator');
const { validationResult } = require('express-validator');
const { infoToken } = require('../helpers/infotoken');

const obtenerHilos = async(req, res) => {

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

        let hilos, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [hilos, total] = await Promise.all([
                Hilo.findById(id).populate('comentarios', '-__v'),
                Hilo.countDocuments()
            ]);

        }
        else {
            [hilos, total] = await Promise.all([
                Hilo.find({}).skip(desde).limit(registropp).populate('comentarios', '-__v'),
                Hilo.countDocuments()
            ]);
        }
        // Si no ha llegado ID, hacemos el get / paginado
        res.json({
            ok: true,
            msg: 'getHilo',
            hilos,
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
            msg: 'Error obteniedo hilo'
        });
    }
}

const crearHilo = async(req, res) => {

    const hilo = new Hilo(req.body);
    await hilo.save();
    res.json({
        ok: true,
        msg: 'crearHilo',
        hilo
    });
}


const actualizarHilo = async(req, res) => {
    const uid = req.params.id;
    const object = req.body;

    try { //de momento actualiza buscando por nombre, está mal ya que el nombre no es único para los eventos

        const evento = await Hilo.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Hilo actualizado',
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

const borrarHilo = async(req, res) => {

    const uid = req.params.id;

    try { //de momento borra buscando por nombre, está mal ya que el nombre no es único para los eventos
        const existeuid = await Hilo.findById(uid);
        if (!existeuid) {
            return res.status(400).json({
                ok: false,
                msg: 'El hilo no existe'
            });
        }
        const resultado = await Hilo.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'borradoHilo',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando hilo'
        });
    }

}

module.exports = { obtenerHilos, crearHilo, actualizarHilo, borrarHilo }