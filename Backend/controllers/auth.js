const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');

const token = async(req, res = response) => {

    const token = req.headers['x-token'];

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no valido',
                token: ''
            });
        }

        const nrol = usuarioBD.rol;

        const nuevotoken = await generarJWT(uid, rol);
        res.json({
            ok: true,
            msg: 'Token',
            uid: uid,
            rol: nrol,
            token: nuevotoken,
            username: usuarioBD.username,
            email: usuarioBD.email,
            imagen: usuarioBD.imagen
        });
    } catch {
        return res.status(400).json({
            ok: false,
            msg: 'Token no valido',
            token: ''
        });
    }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;
    try {
        const usuarioBD = await Usuario.findOne({ email });
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }
        const { _id, rol } = usuarioBD;

        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

        res.json({
            ok: true,
            msg: 'login',
            uid: _id,
            rol,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error login',
            token: ''
        });
    }

}


module.exports = { login, token }