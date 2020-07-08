const inflationDB = require('../models/inflation');
const inflation = require('../models/inflation');
const { compile } = require('morgan');

const inflationController = {};

// employeeController.getEmployees = function () {

    inflationController.getInflations = async (req, res) => {
        const inflations = await inflationDB.find();
        res.json(inflations);
    }

    inflationController.getInflationByID =  async (req, res) => {
        const e = await inflationDB.findById(req.params.id);
        res.json(e);
    }

    inflationController.getInflationsByBonoID = async (req, res) => {
        const digitosFound = req.query.bono_id;
        console.log(digitosFound)
        const inflations = await inflationDB.find({bono_id: digitosFound});
        console.log('ss?');
        console.log(inflations);

        res.json(inflations);
    }


    // method: { type: String, required: true },
    // coin: { type: String, required: true },
    // user_id: { type: String, required: true },

    inflationController.editInflation = async (req, res) => {
        const { id } = req.params;
        const inflation = {
            inflation: req.body.inflation,
            year: req.body.year
        }
        // employeeDB.findById(req.params.id);
        await inflationDB.findByIdAndUpdate(id, {$set: inflation}, {new: true});
        res.json({status: 'Inflation Updated'});

    }

    inflationController.updateManyInflations = async (req, res) => {
        const arr = req.body;
        console.log('aveeeeeeer');
        console.log(arr);
        console.log('xd2');
        // await e.save();
        console.log(arr.length);


        
        for (let i = 0; i < arr.length; i++) {
            const inflation = {
                inflation: arr[i].inflation,
                year: arr[i].year,
                bono_id: arr[i].bono_id
            }
            // var query = { 'inflation': arr[i].inflation, 'year':arr[i].year };
            // var query = { '_id': arr[i]._id };
            var query = {};
            if(typeof arr[i]._id !== 'undefined' ){
                query = { '_id': arr[i]._id };
                await inflationDB.findOneAndUpdate(query, {$set: inflation} , { new:true, upsert: true});    

            }
            if(typeof arr[i]._id === 'undefined'){
                query = { '_id': 'noLoEncontro' };
                const nuevo = new inflationDB(inflation);
                await nuevo.save();

                }

            // var query = { '_id': arr[i]._id };
            // const { id } = arr[i]._id;
            // await inflationDB.findOneAndUpdate(query, {$set: {inflation: arr[i].inflation, year: arr[i].year, bono_id: arr[i].bono_id}} , { upsert: true})    
            // await inflationDB.findOneAndUpdate(query, {$set: inflation} , { new:true, upsert: true});    

            //    await inflationDB.findOneAndUpdate(query, arr[i], { upsert: true})    
            
            // inflationDB.findOneAndUpdate(query, arr[i], { upsert: true}, function(err, doc){
            //     if( err) return res.json(500, {error: err});
            //     return res.json('Successfully saved');
            // })    
        }
       
        // for (let i = 0; i < arr.length; i++) {
        //     var id = arr[i]._id;
        //       var query = {},
        //      update = { $set: {inflation: arr[i].inflation, year: arr[i].year, bono_id: arr[i].bono_id} },
        //     options = { upsert: true, new: true, setDefaultsOnInsert: true };
            // await inflationDB.bulkWrite([
            //     {
                        

            //        update: {
            //            filter: { _id: arr[i]._id },
            //            update: {id, $set: {inflation: arr[i].inflation, year: arr[i].year, bono_id: arr[i].bono_id} },
            //            options: { upsert: true, new: true,  setDefaultsOnInsert: true}
            //        }
            //     }
            // ])
            // var query = {},
            //  update = { $set: {inflation: arr[i].inflation, year: arr[i].year, bono_id: arr[i].bono_id} },
            // options = { upsert: true, new: true, setDefaultsOnInsert: true };


            // await inflationDB.findOneAndUpdate(query, update, options, function(error, result){
            //     if ( error) return;
            //     console.log('aaa');
            //     console.log( result);
            // })

        // }


        res.json(
            {
                'status': 'Many Inflations'});
    };
    

    inflationController.createInflation = async (req, res) => {
         const e = new inflationDB(req.body);
         console.log(e);
         await e.save();
         res.json(
             {
                 'status': 'Inflation saved'});
     };

     inflationController.deleteInflation = async (req, res) => {
         console.log('iii');
         console.log(req);
         console.log(req.params._id);
        await inflationDB.findByIdAndRemove(req.params.id);
        res.json('Inflation deleted');
    }



module.exports = inflationController;