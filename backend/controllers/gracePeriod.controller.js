const gracePeriodDB = require('../models/gracePeriod');

const gracePeriodController = {};


    gracePeriodController.getGracePeriods = async (req, res) => {
        const gracePeriods = await gracePeriodDB.find();
        res.json(gracePeriods);
    }

    gracePeriodController.getGracePeriodByID =  async (req, res) => {
        const e = await gracePeriodDB.findById(req.params.id);
        res.json(e);
    }

    gracePeriodController.getGracePeriodsByBonoID = async (req, res) => {
        const digitosFound = req.query.bono_id;
        console.log(digitosFound)
        const gracePeriods = await gracePeriodDB.find({bono_id: digitosFound});
        console.log('ss?');
        console.log(gracePeriods);

        res.json(gracePeriods);
    }
    gracePeriodController.updateManyGracePeriods = async (req, res) => {
        const arr = req.body;
        for (let i = 0; i < arr.length; i++) {
        const gracePeriod = {
            tipo: arr[i].tipo,
            cuota: arr[i].cuota,
            bono_id: arr[i].bono_id
        }
        var query = {};
            if(typeof arr[i]._id !== 'undefined' ){
                query = { '_id': arr[i]._id };
                await gracePeriodDB.findOneAndUpdate(query, {$set: gracePeriod} , { new:true, upsert: true});    
            }
            if(typeof arr[i]._id === 'undefined'){
                query = { '_id': 'noLoEncontro' };
                const nuevo = new gracePeriodDB(gracePeriod);
                await nuevo.save();

                }
        }
    }
    
    // inflationController.updateManyInflations = async (req, res) => {
    //     const arr = req.body;
    //     console.log('aveeeeeeer');
    //     console.log(arr);
    //     console.log('xd2');
    //     console.log(arr.length);
    //     for (let i = 0; i < arr.length; i++) {
    //         const inflation = {
    //             inflation: arr[i].inflation,
    //             year: arr[i].year,
    //             bono_id: arr[i].bono_id
    //         }
    //         var query = {};
    //         if(typeof arr[i]._id !== 'undefined' ){
    //             query = { '_id': arr[i]._id };
    //             await inflationDB.findOneAndUpdate(query, {$set: inflation} , { new:true, upsert: true});    
    //         }
    //         if(typeof arr[i]._id === 'undefined'){
    //             query = { '_id': 'noLoEncontro' };
    //             const nuevo = new inflationDB(inflation);
    //             await nuevo.save();

    //             }
    //     }
    //     res.json(
    //         {
    //             'status': 'Many Inflations'});
    // };
    


    gracePeriodController.editGracePeriod = async (req, res) => {
        const { id } = req.params;
        const gracePeriod = {
            tipo: req.body.tipo,
            cuota: req.body.cuota
        }
        await gracePeriodDB.findByIdAndUpdate(id, {$set: gracePeriod}, {new: true});
        res.json({status: 'gracePeriod Updated'});

    }

    gracePeriodController.createGracePeriod = async (req, res) => {
         const e = new gracePeriodDB(req.body);
         console.log(e);
         await e.save();
         res.json(
             {
                 'status': 'gracePeriod saved'});
     };

     gracePeriodController.deleteGracePeriod = async (req, res) => {
        await gracePeriodDB.findByIdAndRemove(req.params.id);
        res.json('gracePeriod deleted');
    }



module.exports = gracePeriodController;