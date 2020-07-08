const userDB = require('../models/user');
const jwt = require('jsonwebtoken');

const userController = {};

userController.getUsers = async (req, res) => {
        const users = await userDB.find();
        res.json(users);
    }

    // bonoController.getBonosByUserID = async (req, res) => {
    //     const digitosFound = req.query.user_id;
    //     console.log(digitosFound)
    //     const bonos = await bonoDB.find({user_id: digitosFound});
    //     console.log('ya?');

    //     res.json(bonos);
    // }


    userController.getUsersByType = async (req, res) => {
        console.log(req.body);
        const typeFound = req.body.userType;
        console.log(typeFound);

        const users = await userDB.find({userType: typeFound});
        console.log('usuarios por tipo');
        res.json(users);
    }

    userController.getUserByID =  async (req, res) => {
        // if(req.params.id == '2'){
        //     const e = await userDB.findById(req.params.id);
        // }

        const e = await userDB.findById(req.params.id);
        res.json(e);
    }

    userController.editUser = async (req, res) => {
        const { id } = req.params;
        const user = {
            email: req.body.email,
            password: req.body.password
        }
        // bonoDB.findById(req.params.id);
        await userDB.findByIdAndUpdate(id, {$set: user}, {new: true});
        res.json({status: 'User Updated'});


        
    }

    userController.createUser = async (req, res) => {
        console.log(req.body);
        const {email, password, userType } = req.body;
        const newUser = new userDB({email,password, userType});
         await newUser.save();

         /////////poner la variable de entorno aqui
         const token = jwt.sign({_id: newUser._id}, 'secretKey')
         ///////guardar el id por mientras asi pero no se debe hacer
         const u_id = newUser._id;
         const u_Type = newUser.userType;

         res.status(200).json({token, u_id, u_Type})
     };

     userController.signin = async (req, res) => {
         const { email, password, userType } = req.body;
         const user = await userDB.findOne({email, password});
         const errorUser = "El usuario no se encuentra registrado";
         const errorPass = "Contraseña incorrecta";

        if (!user) {
        return res.status(401).send('El usuario no se encuentra registrado');
        }
        // return res.status(401).send("El usuario no se encuentra registrado");
        if (user.password !== password)
        return res.status(401).send('Contraseña incorrecta');

        //  return res.status(401).send('Contraseña incorrecta');

        const token = jwt.sign({_id: user._id}, 'secretKey');
        const u_id = user._id;
        const u_Type = user.userType;

        return res.status(200).json({token, u_id, u_Type});

     };



     userController.deleteUser = async (req, res) => {
         console.log('aa');
        //  console.log(req.params.id);
        await userDB.findByIdAndRemove(req.params.id);
        res.json('User deleted');
    }



module.exports = userController;