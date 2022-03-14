const Album = require('../models/album');
const validator = require('validator');
const { validationResult } = require('express-validator');
const { infoToken } = require('../helpers/infotoken');

const obtenerAlbumes = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        // console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || '';

    //await sleep(1000);
    try {

        // Solo puede listar usuarios un admin

        let albumes, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [albumes, total] = await Promise.all([
                Album.findById(id),
                Album.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            if (texto) {
                [albumes, total] = await Promise.all([
                    Album.find({ $or: [{ nombre: textoBusqueda }, { artista: textoBusqueda }] }).skip(desde).limit(registropp),
                    Album.countDocuments({ $or: [{ nombre: textoBusqueda}, { artista: textoBusqueda }] })
                ]);
            } else {
                [albumes, total] = await Promise.all([
                    Album.find({}).skip(desde).limit(registropp),
                    Album.countDocuments()
                ]);
            }

        }

        res.json({
            ok: true,
            msg: 'getAlbumes',
            albumes,
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
            msg: 'Error obteniedo albumes'
        });
    }
}

const crearAlbumes = async(req, res) => {

    const album = new Album(req.body);
    await album.save();
    res.json({
        ok: true,
        msg: 'crearAlbum',
        album
    });
}

const actualizarAlbumes = async(req, res) => {
    const { nombre, ...object } = req.body;
    const uid = req.params.id;

    try {
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ADMIN' || infoToken(token).uid === uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este album'
            });
        }
        // Comprobar si existe el usuario que queremos actualizar
        const existeAlbum = await Album.findById(uid);

        if (!existeAlbum) {
            return res.status(400).json({
                ok: false,
                msg: 'El album no existe'
            });
        }
        // llegadoa aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.nombre = nombre;

        // Si el rol es de administrador, entonces si en los datos venía el campo activo lo dejamos
        if ((infoToken(token).rol === 'ADMIN') && activo) {
            object.activo = activo;
        }
        // al haber extraido password del req.body nunca se va a enviar en este put
        const album = await Album.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Album actualizado',
            album
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando albumes'
        });
    }

}
const borrarAlbumes = async(req, res) => {

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
        const existeAlbumes = await Album.findById(uid);
        if (!existeAlbumes) {
            return res.status(400).json({
                ok: true,
                msg: 'El album no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Album.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Album eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando album'
        });
    }

}


module.exports = { obtenerAlbumes, crearAlbumes, actualizarAlbumes, borrarAlbumes }