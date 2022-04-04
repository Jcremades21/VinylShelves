/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerReviews, crearReview, actualizarReview, borrarReview } = require('../controllers/reviews');

const router = Router();

router.get('/', obtenerReviews);
router.post('/', [
    check('titulo', 'El argumento titulo es obligatorio').not().isEmpty(),
    check('texto', 'El argumento texto es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol
], crearReview);
router.put('/:id', [
    check('titulo', 'El argumento titulo es obligatorio').not().isEmpty(),
    check('texto', 'El argumento texto es obligatorio').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRol
], actualizarReview);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarReview);
module.exports = router;