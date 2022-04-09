/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerListas, crearLista, actualizarLista, borrarLista } = require('../controllers/listal');

const router = Router();

router.get('/', obtenerListas);
router.post('/', [
    check('titulo', 'El argumento titulo es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol
], crearLista);
router.put('/:id', [
    check('titulo', 'El argumento titulo es obligatorio').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRol
], actualizarLista);
router.delete('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarLista);
module.exports = router;