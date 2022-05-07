/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerReporteC, crearReportesC, actualizarReportesC, borrarReportesC } = require('../controllers/reporte_comentario');

const router = Router();

router.get('/', obtenerReporteC);
router.post('/', [
    validarJWT,
    check('usuario', 'El argumento usuario es obligatorio').not().isEmpty(),
    check('usuario_reportado', 'El argumento usuario reportado').not().isEmpty(),
    check('comentario', 'El argumento comentario es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol
], crearReportesC);
router.put('/:id', [
    validarJWT,
    check('usuario', 'El argumento usuario es obligatorio').not().isEmpty(),
    check('usuario_reportado', 'El argumento usuario reportado').not().isEmpty(),
    check('comentario', 'El argumento comentario es obligatorio').not().isEmpty(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRol
], actualizarReportesC);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarReportesC);
module.exports = router;