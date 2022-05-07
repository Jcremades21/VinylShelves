const { response } = require('express');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { actualizarBD } = require('../helpers/actualizarbd');
const fs = require('fs');

const subirArchivo = async(req, res) => {
    console.log(req.body._parts[0][1].name);
    if (!req.body._parts|| Object.keys(req.body._parts).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado archivo'
        });
    }

    const tipo = req.body._parts[0][1].type; //foto
    const id = req.params.id;

    const archivosValidos = {
        foto: ['jpeg', 'jpg', 'png'],
    }

    const archivo = req.body._parts[0][1];
    const nombrePartido = archivo.name.split('.');
    const extension = nombrePartido[nombrePartido.length - 1];

    const path = `${process.env.PATHUPLOAD}`;
    console.log(path);
    const nombreArchivo = `${uuidv4()}.${extension}`;
    console.log(nombreArchivo);
    const uploadPath = `${process.env.PATHUPLOAD}/foto/usuario/${nombreArchivo}`;
    console.log(uploadPath);
    archivo.mv(uploadPath, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo cargar el archivo`,
                tipoOperacion: tipo
            });
        }

        actualizarBD(path, nombreArchivo, id)
            .then(valor => {
                if (!valor) {
                    console.log(uploadPath);
                    fs.unlinkSync(uploadPath);
                    return res.status(400).json({
                        ok: false,
                        msg: `No se ha podido actualizar la BD`,
                    });
                } else {

                    res.json({
                        ok: true,
                        msg: 'subirArchivo',
                        nombreArchivo
                    });
                }
                // controlar valor
            }).catch(error => {
                fs.unlinkSync(uploadPath);
                return res.status(400).json({
                    ok: false,
                    msg: `Error al cargar la imagen`,
                });
            });

    });




}

const enviarArchivo = async(req, res) => {

    const tipo = req.params.tipo; //foto
    const nombreArchivo = req.params.nombreArchivo;

    const path = `${process.env.PATHUPLOAD}`;

    const uploadPath = `${process.env.PATHUPLOAD}/foto/usuario/${nombreArchivo}`;

    if (!fs.existsSync(uploadPath)) {


        res.sendFile(`${path}/no-imagen.png`);

        /*return res.status(400).json({
            ok: false,
            msg: 'Archivo no existe',

        });*/
    } else {
        res.sendFile(uploadPath);
    }

}


module.exports = { subirArchivo, enviarArchivo }