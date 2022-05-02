/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerRatings, crearRatings, actualizarRatings, borrarRatings } = require('../controllers/rating');

const router = Router();

router.get('/', obtenerRatings);
router.post('/', [
    check('estrellas', 'El argumento estrellas es obligatorio').not().isEmpty(),
    check('album', 'El argumento album es obligatorio').not().isEmpty(),
    check('usuario', 'El argumento usuario es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol
], crearRatings);
router.put('/:id', [
    check('estrellas', 'El argumento estrellas es obligatorio').not().isEmpty(),
    check('album', 'El argumento album es obligatorio').not().isEmpty(),
    check('usuario', 'El argumento usuario es obligatorio').not().isEmpty(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRol
], actualizarRatings);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarRatings);
module.exports = router;