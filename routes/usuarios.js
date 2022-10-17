/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, inhabilitarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    validarCampos,
] , crearUsuario);

router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarUsuario);

router.delete('/:id' ,
    validarJWT,
    [
        check('id', 'El id es obligatorio').not().isEmpty(),
        validarCampos,
    ], eliminarUsuario);

router.put('/:id', [
    check('id', 'El id es obligatorio').not().isEmpty(),
    validarCampos,
] ,inhabilitarUsuario);

module.exports = router;