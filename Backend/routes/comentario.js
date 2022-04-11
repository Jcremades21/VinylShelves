/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerComentario, crearComentario, actualizarComentario, borrarComentario } = require('../controllers/comentario');

const router = Router();

router.get('/', obtenerComentario);
router.post('/', [
    check('texto', 'El argumento texto es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol
], crearComentario);
router.put('/:id', [
    validarJWT,
    check('texto', 'El argumento texto es obligatorio').not().isEmpty(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRol
], actualizarComentario);
router.delete('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarComentario);
module.exports = router;