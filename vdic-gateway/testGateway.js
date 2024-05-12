const axios = require("axios")
const fs = require('fs');
const path = require('path');
const testFolder = '../test-data/';

const secret = "password"

const toBeUploadedJson = {
    "hey": "this",
    "is": "a",
    "test": "ok?!"
}

const wait5Seconds = async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));
}

const testUploadAndDownloadToVdic = () => {

    // get files from test-data folder
    fs.readdirSync(testFolder).forEach(async file => {
        const data = fs.readFileSync(path.join(testFolder, file), 'utf8'); //read to be uploaded files

        // upload to moralis 30 times and measure each time performance
        for (let i = 0; i < 1; i++) { //TOPO: change to 30
            const start = new Date(); //start timer
            // write file to VDIC
            axios.post(
                "http://localhost:3001/gateway/write", 
                {
                    path : path.join(testFolder, file),
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
                    const writeRes = fs.appendFileSync('./vdic-write-performance-measurements.csv', `${start},VDIC,write,${cid},${size},${writePerformance}\n`); 

                    wait5Seconds();

                    // read file from VDIC
                    const startRead = new Date(); //start timer
                    axios.get(
                        "http://localhost:3001/gateway/read/"+cid,
                        {
                            headers: {
                                'Authorization': 'Basic ' + secret
                            }
                        }
                    )
                    .then(res => {
                        const endRead = new Date(); //end timer
                        //check if file was written to VDICs
                        if(res.data.file){	
                            //document read performance
                            const readPerformance = endRead - startRead;
                            const size = Buffer.byteLength(data, 'utf8') / 1024;
                            const readRes = fs.appendFileSync('./vdic-read-performance-measurements.csv', `${startRead},VDIC,write,${cid},${size},${readPerformance}\n`);
                        }else{
                            console.log("Error reading file with CID: "+cid);
                        }
                    }).catch(err => {
                        console.log(err)
                    })

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

testUploadAndDownloadToVdic()