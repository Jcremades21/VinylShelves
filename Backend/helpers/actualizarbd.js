const Usuario = require('../models/usuarios');
const fs = require('fs');

const actualizarBD = async(path, nombreArchivo, id) => {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
        return false;
    }

    const fotoVieja = usuario.imagen;
    const pathFotoVieja = `${path}/foto/${fotoVieja}`;
    if (fotoVieja && fs.existsSync(pathFotoVieja)) {
        fs.unlinkSync(pathFotoVieja);
    }

    usuario.imagen = nombreArchivo;
    await usuario.save();

    return true;

}



module.exports = { actualizarBD}