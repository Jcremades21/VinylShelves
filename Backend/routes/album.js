/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { obtenerAlbumes, crearAlbumes, borrarAlbumes, actualizarAlbumes } = require('../controllers/album');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', obtenerAlbumes);
router.post('/', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('artista', 'El argumento artista es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol
], crearAlbumes);
router.put('/:id', [
    validarJWT,
    check('email', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('artista', 'El argumento artista es obligatorio').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRol
], actualizarAlbumes);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarAlbumes);
module.exports = router;