const fs = require('fs');
const path = require('path');
const axios = require("axios")
const secret = "password"

//TODO: make two reading possibilites in routes.js: 
//1. read form node (docker exec -ti ipfs0 sh and then ipfs cat QmeDtmGQaPtD1YTzjSDKyyNkCbPHpukNDURiM7JoZzGvut or ipfs get QmeDtmGQaPtD1YTzjSDKyyNkCbPHpukNDURiM7JoZzGvut) 
//2. read from public ipfs gateway: axios get: http://localhost:8080/Qma5zNnnAuDdtpF5d8WjzqBGfTYSenh4Uss2zu8RP8Awj5

//import pinata-write-performance-measurements.csv file and iterate over each line
const data = fs.readFileSync('./vdic-write-performance-measurements.csv', 'utf8').split("\n");
data.forEach(async line => {
    const lineData = line.split(",");
    const cid = lineData[3];
    const size = lineData[4];

    // read all 150 files which are 30 versions of the same 5 files in test-data
    const start = new Date(); //start timer
    axios.get(
        "http://localhost:3001/gateway/read/"+cid,
        {
            headers: {
                'Authorization': 'Basic ' + secret
            }
        }
    )
    .then(res => {
        const end = new Date(); //end timer
        //check if file was written to VDICs
        if(res.data.file){	
            //document read performance
            const readPerformance = end - start;
            const size = Buffer.byteLength(data, 'utf8') / 1024;
            const readRes = fs.appendFileSync('./vdic-read-performance-measurements.csv', `${start},VDIC,write,${cid},${size},${readPerformance}\n`);
        }else{
            console.log("Error reading file with CID: "+cid);
        }
    }).catch(err => {
        console.log(err)
    })
    const end = new Date(); //end timer

    //wait 5 seconds till next for loop iteration
    await new Promise(resolve => setTimeout(resolve, 5000));
});