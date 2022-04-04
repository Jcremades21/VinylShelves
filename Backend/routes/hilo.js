/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerHilos, crearHilo, actualizarHilo, borrarHilo } = require('../controllers/hilo');

const router = Router();

router.get('/', obtenerHilos);
router.post('/', [
    check('comentarios', 'El argumento comentarios es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol
], crearHilo);
router.put('/:id', [
    validarJWT,
    check('comentarios', 'El argumento comentarios es obligatorio').not().isEmpty(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRol
], actualizarHilo);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarHilo);
module.exports = router;