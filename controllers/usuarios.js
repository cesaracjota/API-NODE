const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res = response) => {
    try {
        const usuarios = await Usuario.find({}, 'nombre correo password role estado google');

        res.json({
            ok: true,
            usuarios,
            uid: req.uid,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}

const crearUsuario = async(req, res = response) => {

    const { correo, password, nombre } = req.body;
    
    try {
        
        const existeEmail = await Usuario.findOne({ correo });
    
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }
        
        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.uid);

        res.json({
            ok: true,
            usuario,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}

const actualizarUsuario = async(req, res = response) => {

    //TODO: Validar token y comprobar si es el usuario correcto
    
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { password, google, correo, ...campos } = req.body;

        if (usuarioDB.correo !== correo) {
            const existeEmail = await Usuario.findOne({ correo });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese correo'
                });
            }
        }

        campos.correo = correo;

        if (!usuarioDB.google) {
            campos.correo = correo;
        } else if (usuarioDB.correo !== correo) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const inhabilitarUsuario = async(req, res = response) => {
        
        const uid = req.params.id;
    
        try {
    
            const usuarioDB = await Usuario.findById(uid);
    
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario por ese id'
                });
            }
    
             // Actualizaciones
        const { password, google, correo, estado, ...campos } = req.body;

        if (usuarioDB.correo !== correo) {
            const existeEmail = await Usuario.findOne({ correo });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese correo'
                });
            }
        }

        campos.correo = correo;
        campos.estado = false;

        if (!usuarioDB.google) {
            campos.correo = correo;
        } else if (usuarioDB.correo !== correo) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });
    
            res.json({
                ok: true,
                usuario: usuarioActualizado
            });
    
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }
}

const eliminarUsuario = async(req, res = response) => {
    
        const uid = req.params.id;
    
        try {
    
            const usuarioDB = await Usuario.findById(uid);
    
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario por ese id'
                });
            }
    
            await Usuario.findByIdAndDelete(uid);
    
            res.json({
                ok: true,
                msg: 'Usuario eliminado'
            });
    
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    inhabilitarUsuario,
}