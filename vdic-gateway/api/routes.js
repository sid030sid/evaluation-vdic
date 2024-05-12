const router = require('express').Router();
const axios = require('axios')
const fs = require('fs');
require('dotenv').config()

// HELPER FUNCTIONS
// function to add a line to a CSV file
const documentMeasurement = (path, line) => {
    // append the line to the CSV file
    fs.appendFile(path, (new Date()).toString()+","+line + '\n', (err) => {
        if (err) {
            console.error('Error appending to CSV ("'+path+'"):', err);
        } else {
            console.log('Line successfully added to: "'+path+'"');
        }
    });
}

// ENDPOINTS FOR AUTHENTICATION
// TODO: simplfy do not do as in real-life implementation ... here the OID4VP based authentication is performed

// MIDDLEWARE CHECKING AUTHENTICATION
router.use(async (req, res, next) => {
    try {
        // check if the requester posses correct and not expired token
        const token = req.headers["authorization"].split(" ")[1];
        if (token === process.env.SECRET) {      
            next();
        }else{
            res.status(401).json({ message: "You are not authenticated!" });
        }
    } catch (error) {
        console.log(error);
    }
  }
); 

// ENDPOINTS OF GATEWAY
// GET: file based on inputted cid
router.route('/read/:cid').get(async (req, res) => {
    try {
        // get data from body
        const cid = req.params.cid

        // start measurement
        const start = new Date()

        // get file from DIC
        const file = "todo"
        //TODO

        // end measurement
        const end = new Date()

        // send file to user
        if(file){

            // store measurement with scheme: operationType (= read or write), cid, fileSize, executionTime
                //const measurement ="didCheqdCredentialServiceAPI,tracing,"+didId+","+history.length+","+numberCompartments+","+(end.getTime()-start.getTime())
                //documentMeasurement("../measurements/tracingMeasurements.csv", measurement)

            // send info to requester
            res.send({
                cid:cid
            })
        }else{
            res.send(`ERROR: reading file ${cid} failed!`)
        }
    } catch (error) {
        error.response ? console.error(error.response.data) : console.error(error)
    }
})

// POST: file to DIC
router.route('/write').post(async (req, res) => {
    try {

        // start measurement
        const start = new Date()

        // get file from body
        const file = req.body.file

        // post file to DIC and get its cid
        //TODO
        const cid = "todo"

        // end measurement
        const end = new Date()

        // send file to user
        if(cid){

            // store measurement with scheme: operationType (= read or write), cid, fileSize, executionTime
                //const measurement ="didCheqdCredentialServiceAPI,tracing,"+didId+","+history.length+","+numberCompartments+","+(end.getTime()-start.getTime())
                //documentMeasurement("../measurements/tracingMeasurements.csv", measurement)

            // send info to requester
            res.send({
                file:file
            })
        }else{
            res.send(`ERROR: writing file to DIC failed!`)
        }
    } catch (error) {
        error.response ? console.error(error.response.data) : console.error(error)
    }
})

module.exports = router;