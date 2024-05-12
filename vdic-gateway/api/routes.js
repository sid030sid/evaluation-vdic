const router = require('express').Router();
const axios = require('axios')
const fs = require('fs');
require('dotenv').config()

//IPFS CLUSTER CTL COMMANDS are the following ENDPOINTS:
    //stauts ls command --> GET: http://127.0.0.1:9094/peers

    //write file to VDICs:
        //1. add <filepath> --> POST: http://127.0.0.1:9094/add?chunker=size-262144&cid-version=0&format=unixfs&hash=sha2-256&hidden=false&layout=&local=false&mode=recursive&name=&no-pin=false&nocopy=false&progress=false&raw-leaves=false&recursive=false&replication-max=0&replication-min=0&shard=false&shard-size=104857600&stream-channels=true&user-allocations=&wrap-with-directory=false
                                     // or for 10kb.txt: POST: http://127.0.0.1:9094/add?chunker=size-262144&cid-version=0&format=unixfs&hash=sha2-256&hidden=false&layout=&local=false&mode=recursive&name=&no-pin=false&nocopy=false&progress=false&raw-leaves=false&recursive=false&replication-max=0&replication-min=0&shard=false&shard-size=104857600&stream-channels=true&user-allocations=&wrap-with-directory=false
        //2. pin add <cid> --> POST: http://127.0.0.1:9094/pins/ipfs/QmP5m4vxj9uUwrEJG53bPw3X2onwoywqevrGZ2Yzfngoay?mode=recursive&name=&replication-max=0&replication-min=0&shard-size=0&user-allocations=
    
    //get information about latency
        //pin ls <cid> --> GET: http://127.0.0.1:9094/allocations/QmP5m4vxj9uUwrEJG53bPw3X2onwoywqevrGZ2Yzfngoay
                        //do not use: status <cid> --> GET: http://127.0.0.1:9094/pins/QmP5m4vxj9uUwrEJG53bPw3X2onwoywqevrGZ2Yzfngoay?local=false --> here we can get the latency from as timestamp of each node's pin info indicates when the file was added
        //see difference: https://ipfscluster.io/documentation/reference/ctl/

    //read file from VDICs via IPFS:
        //1. GET: https://ipfs.io/ipfs/QmP5m4vxj9uUwrEJG53bPw3X2onwoywqevrGZ2Yzfngoay

    // CID of 1kb.txt: QmP5m4vxj9uUwrEJG53bPw3X2onwoywqevrGZ2Yzfngoay


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

        // get file from VDIC
        const file = await axios.get(`https://ipfs.io/ipfs/${cid}`)

        // send file to user
        if(file){

            // send info to requester
            res.send({
                cid:cid,
                file:file
            })
        }else{
            res.send(`ERROR: reading file ${cid} failed!`)
        }
    } catch (error) {
        error.response ? console.error(error.response.data) : console.error(error)
    }
})

// POST: file to VDIC
router.route('/write').post(async (req, res) => {
    try {

        // start measurement
        const start = new Date() //TODO: move this to testGateway.js

        // get path from body
        const path = req.body.path

        // post file to VDIC and get its cid
        const resWriteToVdic = await axios.post(
            "http://127.0.0.1:9094/add?chunker=size-262144&cid-version=0&format=unixfs&hash=sha2-256&hidden=false&layout=&local=false&mode=recursive&name=&no-pin=false&nocopy=false&progress=false&raw-leaves=false&recursive=false&replication-max=0&replication-min=0&shard=false&shard-size=104857600&stream-channels=true&user-allocations=&wrap-with-directory=false",
            {path:path}, //TODO this probably needs to be corrected,
            {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            }
        ) // add file                
        const cid = resWriteToVdic.data.cid
        
        const resPinToVdic = await axios.post(
            "http://127.0.0.1:9094/pins/ipfs/"+cid+"?mode=recursive&name=&replication-max=0&replication-min=0&shard-size=0&user-allocations="
        ) //pin file

        // send file to user
        if(cid){
            // send info to requester
            res.send({
                cid:cid
            })
        }else{
            res.send(`ERROR`)
        }
    } catch (error) {
        error.response ? console.error(error.response.data) : console.error(error)
    }
})

module.exports = router;