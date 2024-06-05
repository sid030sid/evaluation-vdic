const fs = require('fs');
const path = require('path');
const axios = require("axios")

const secret = "password"
const numberOfNodes = process.argv[2] //3, 5, 10, 15, or 20 inserted as command line argument

//ensure correct command line argument input
if (!["3", "5", "10", "15", "20"].includes(numberOfNodes)) {
    console.log("Please enter a valid number of nodes: 3, 5, 10, 15, or 20");
    process.exit(1);
}

//clear all data in csv: ${numberOfNodes}-node-vdic-read-performance-measurements.csv
fs.writeFileSync(`./performance-measurements/${numberOfNodes}-node-vdic-read-performance-measurements.csv`, "");

//import pinata-write-performance-measurements.csv file and iterate over each line
const data = fs.readFileSync(`./performance-measurements/${numberOfNodes}-node-vdic-write-performance-measurements.csv`, 'utf8').split("\n");
data.forEach(async line => {
    if(line) {
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
                const readRes = fs.appendFileSync(`./performance-measurements/${numberOfNodes}-node-vdic-read-performance-measurements.csv`, `${start},VDIC,read,${cid},${size},${readPerformance}\n`);
            }else{
                console.log("Error reading file with CID: "+cid);
            }
        }).catch(err => {
            console.log(err)
        })

        //wait 5 seconds till next for loop iteration
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
});

console.log("Read test done!")