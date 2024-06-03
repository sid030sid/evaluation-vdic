const axios = require("axios")
const fs = require('fs');
const path = require('path');
const testFolder = '../test-data/';

const secret = "password"

const numberOfNodes = process.argv[2] //3, 5, 10, 15, or 20 inserted as command line argument

//ensure correct command line argument input
if (!["3", "5", "10", "15", "20"].includes(numberOfNodes)) {
    console.log("Please enter a valid number of nodes: 3, 5, 10, 15, or 20");
    process.exit(1);
}

//clear all data in csv: ${numberOfNodes}-node-vdic-write-performance-measurements.csv
fs.writeFileSync(`./performance-measurements/${numberOfNodes}-node-vdic-write-performance-measurements.csv`, "");

// write test script
const testUploadToVdic = () => {

    // get files from test-data folder
    fs.readdirSync(testFolder).forEach(async file => {
        const data = fs.readFileSync(path.join(testFolder, file), 'utf8'); //read to be uploaded files

        // upload to VDIC 30 times and measure each time performance
        for (let i = 0; i < 30; i++) { 
            const start = new Date(); //start timer
            // write file to VDIC
            axios.post(
                "http://localhost:3001/gateway/write", 
                {
                    file:data,
                },
                {
                    headers: {
                        'Authorization': 'Basic ' + secret
                    }
                }
            )
            .then(res => {
                const end = new Date(); //end timer
                const cid = res.data.cid

                //check if file was written to VDICs
                if(cid === "ERROR"){	
                    console.log("Error writing to VDIC");
                }else{
                    //document write performance
                    const writePerformance = end - start;
                    const size = Buffer.byteLength(data, 'utf8') / 1024;
                    const writeRes = fs.appendFileSync(`./performance-measurements/${numberOfNodes}-node-vdic-write-performance-measurements.csv`, `${start},VDIC,write,${cid},${size},${writePerformance}\n`);
                    
                    //delete newly written file from VDIC 
                    //if this is not the 30th iteration of the for-loop
                    if(i !== 29){
                        axios.post(
                            "http://localhost:3001/gateway/delete", 
                            {
                                cid:cid,
                            },
                            {
                                headers: {
                                    'Authorization': 'Basic ' + secret
                                }
                            }
                        ).then(res => {
                            console.log("File unpinned");
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }
            }).catch(err => {
                console.log(err)
            })

            //wait 5 seconds till next for loop iteration
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        //wait 10 seconds till next for loop iteration
        await new Promise(resolve => setTimeout(resolve, 10000));
    });
}

// run write test
testUploadToVdic()