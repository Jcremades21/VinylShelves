const Usuario = require('../models/usuarios');
const validator = require('validator');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { infoToken } = require('../helpers/infotoken');

const obtenerUsuarios = async(req, res) => {

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
        /*const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ADMIN') || (infoToken(token).uid === id))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar usuarios',
            });
        }*/

        let usuarios, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [usuarios, total] = await Promise.all([
                Usuario.findById(id),
                Usuario.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            if (texto) {
                [usuarios, total] = await Promise.all([
                    Usuario.find({ $or: [{ username: textoBusqueda }, { email: textoBusqueda }] }).skip(desde).limit(registropp),
                    Usuario.countDocuments({ $or: [{ username: textoBusqueda}, { email: textoBusqueda }] })
                ]);
            } else {
                [usuarios, total] = await Promise.all([
                    Usuario.find({}).skip(desde).limit(registropp),
                    Usuario.countDocuments()
                ]);
            }

        }

        res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios,
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
            msg: 'Error obteniedo usuarios'
        });
    }
}

const crearUsuario = async(req, res) => {
    const { email, password, rol } = req.body;
    const existeEmail = await Usuario.findOne({ email: email });

    if (existeEmail) {
        return res.status(400).json({
            ok: false,
            msg: 'Email ya existe'
        });
    }

    const salt = bcrypt.genSaltSync(); // generamos un salt, una cadena aleatoria
    const cpassword = bcrypt.hashSync(password, salt); // y aquí ciframos la contraseña

    const usuario = new Usuario(req.body);
    usuario.password = cpassword;
    await usuario.save();
    res.json({
        ok: true,
        msg: 'crearUsuarios',
        usuario
    });
}

const actualizarUsuario = async(req, res) => {
    const { email, password, activo, ...object } = req.body;
    const uid = req.params.id;

    try {
        // Para actualizar usuario o eres admin o eres usuario del token y el uid que nos llega es el mismo
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ADMIN' || infoToken(token).uid === uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este perfil'
            });
        }

        const existeEmail = await Usuario.findOne({ email: email });
        if (existeEmail) {
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }
        object.email = email;

        // Comprobar si existe el usuario que queremos actualizar
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
        // llegadoa aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.email = email;

        // Si el rol es de administrador, entonces si en los datos venía el campo activo lo dejamos
        if ((infoToken(token).rol === 'ADMIN') && activo) {
            object.activo = activo;
        }
        // al haber extraido password del req.body nunca se va a enviar en este put
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}
const borrarUsuario = async(req, res) => {

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

        // No me puedo borrar a mi mismo
        if ((infoToken(token).uid === uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no puede eliminarse a si mismo',
            });
        }

        // Comprobamos si existe el usuario que queremos borrar
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Usuario.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando usuario'
        });
    }

}


const actualizarPassword = async(req, res = response) => {

    const uid = req.params.id;
    const { password, nuevopassword, nuevopassword2 } = req.body;

    try {
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        if (!((infoToken(token).rol === 'ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para actualizar contraseña',
            });
        }

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }


        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        // Si es el el usuario del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
        // dos veces la contraseña nueva
        if (infoToken(token).uid === uid) {

            if (nuevopassword !== nuevopassword2) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La contraseña repetida no coincide con la nueva contraseña',
                });
            }

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                    token: ''
                });
            }
        }

        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);
        usuarioBD.password = cpassword;

        // Almacenar en BD
        await usuarioBD.save();

        res.json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
    }


}

module.exports = { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, actualizarPassword }