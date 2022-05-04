/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerReporteU, crearReportesU, actualizarReportesU, borrarReportesU } = require('../controllers/reporte_usuario');

const router = Router();

router.get('/', obtenerReporteU);
router.post('/', [
    check('usuario', 'El argumento usuario es obligatorio').not().isEmpty(),
    check('usuario_reportado', 'El argumento usuario reportado').not().isEmpty(),
    validarCampos,
    validarRol
], crearReportesU);
router.put('/:id', [
    check('usuario', 'El argumento usuario es obligatorio').not().isEmpty(),
    check('usuario_reportado', 'El argumento usuario reportado').not().isEmpty(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRol
], actualizarReportesU);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarReportesU);
module.exports = router;