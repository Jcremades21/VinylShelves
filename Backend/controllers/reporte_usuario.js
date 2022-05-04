const Reporte = require('../models/reporte_usuario');
const validator = require('validator');
const { validationResult } = require('express-validator');
const { infoToken } = require('../helpers/infotoken');

const obtenerReporteU = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const pag = req.query.pag;
    let textoBusqueda = '';

    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || '';

    //await sleep(1000);
    try {

        // Solo puede listar usuarios un admin

        let reportesc, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [reportesc, total] = await Promise.all([
                Reporte.findById(id).populate('usuario', '-__v'),
                Reporte.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
         
                if(pag){
                [reportesc, total] = await Promise.all([
                    Reporte.find({}).skip(desde).populate('usuario', '-__v').populate('usuario_reportado', '-__v'),
                    Reporte.countDocuments()
                ]);
                }
                else{
                [reportesc, total] = await Promise.all([
                    Reporte.find({}).skip(desde).limit(registropp).populate('usuario', '-__v').populate('usuario_reportado', '-__v'),
                    Reporte.countDocuments()
                ]);
                }
            
            }

        res.json({
            ok: true,
            msg: 'getReportes',
            reportesc,
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
            msg: 'Error obteniedo reportes'
        });
    }
}

const crearReportesU = async(req, res) => {

    const rat = new Reporte(req.body);
    await rat.save();
    res.json({
        ok: true,
        msg: 'crearReporte',
        rat
    });
}

const actualizarReportesU = async(req, res) => {
    const uid = req.params.id;
    const object = req.body;

    try { //de momento actualiza buscando por nombre, está mal ya que el nombre no es único para los eventos

        const rat = await Reporte.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Reporte actualizado',
            rat
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando reporte'
        });
    }

}

const borrarReportesU = async(req, res) => {

    const uid = req.params.id;

    try {
        // Solo puede borrar usuarios un admin
        const token = req.header('x-token');

        if (!(infoToken(token).rol === 'ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para borrar reportes',
            });
        }

        // Comprobamos si existe el usuario que queremos borrar
        const existeAlbumes = await Reporte.findById(uid);
        if (!existeAlbumes) {
            return res.status(400).json({
                ok: true,
                msg: 'El reporte no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Reporte.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Reporte eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando reporte'
        });
    }

}


module.exports = { obtenerReporteU, crearReportesU, actualizarReportesU, borrarReportesU }