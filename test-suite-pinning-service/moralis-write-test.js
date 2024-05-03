const moralisPinningService = require('./moralis-pinning-service');
const fs = require('fs');
const path = require('path');
const testFolder = '../test-data/';

//import each file in test-data folder and write it to moralis
fs.readdirSync(testFolder).forEach(async file => {
    const data = fs.readFileSync(path.join(testFolder, file), 'utf8'); //read file

    // upload to moralis 30 times and measure each time performance
    for (let i = 0; i < 30; i++) {
        const start = new Date(); //start timer
        const uploadedFileIPFSpath = await moralisPinningService.writeToMoralis(data); //write file to moralis
        const end = new Date(); //end timer

        //check if file was written to moralis
        if(uploadedFileIPFSpath === "ERROR"){
            console.log("Error writing to moralis");
        }else{
            //write uploadedFileIPFSpath, writePerformance and size to csv file pinning-service-performance.csv
            const writePerformance = end - start;
            const size = Buffer.byteLength(data, 'utf8') / 1024;
            const writeRes = fs.appendFileSync('./moralis-write-performance-measurements.csv', `${start},moralis,write,${uploadedFileIPFSpath},${size},${writePerformance}\n`); 
            console.log("File successfully updated as: ", uploadedFileIPFSpath);
        }

        //wait 5 seconds till next for loop iteration
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    //wait 10 seconds till next for loop iteration
    await new Promise(resolve => setTimeout(resolve, 10000));
});

