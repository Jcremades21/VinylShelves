/*
Ruta base: /api/upload
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { subirArchivo, enviarArchivo} = require('../controllers/uploads');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.get('/:tipo/usuario/:nombreArchivo', [
    validarJWT,
    check('nombreArchivo', 'Debe ser un nombre de archivo valido').trim(),
    validarCampos,
], enviarArchivo);
router.post('/:tipo/usuario/:id', [
    validarJWT,
    check('id', 'El id de la foto debe ser válido').isMongoId(),
    validarCampos,
], subirArchivo);

module.exports = router;