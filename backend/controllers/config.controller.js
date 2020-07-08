const configDB = require('../models/config');

const configController = {};

// employeeController.getEmployees = function () {

    configController.getConfigs = async (req, res) => {
        const configs = await configDB.find();
        res.json(configs);
    }

    configController.getConfigByID =  async (req, res) => {
        const e = await configDB.findById(req.params.id);
        res.json(e);
    }

    configController.getConfigsByUserID = async (req, res) => {
        const digitosFound = req.query.user_id;
        console.log(digitosFound)
        const configs = await configDB.find({user_id: digitosFound});
        console.log('ss?');
        console.log(configs);

        res.json(configs);
    }


    // method: { type: String, required: true },
    // coin: { type: String, required: true },
    // user_id: { type: String, required: true },

    configController.editConfig = async (req, res) => {
        const { id } = req.params;
        const config = {
            method: req.body.method,
            coin: req.body.coin
        }
        // employeeDB.findById(req.params.id);
        await configDB.findByIdAndUpdate(id, {$set: config}, {new: true});
        res.json({status: 'Config Updated'});

    }

    configController.createConfig = async (req, res) => {
         const e = new configDB(req.body);
         console.log(e);
         await e.save();
         res.json(
             {
                 'status': 'Config saved'});
     };

     configController.deleteConfig = async (req, res) => {
        await configDB.findByIdAndRemove(req.params.id);
        res.json('Config deleted');
    }



module.exports = configController;