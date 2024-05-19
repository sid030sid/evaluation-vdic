const pinataPinningService = require('./pinata-pinning-service');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const testFolder = '../test-data/';

// get the name of each file in the test-data folder (path to folder: '../test-data/')
fs.readdirSync(testFolder).forEach(async fileName => {

    const data = fs.readFileSync(path.join(testFolder, fileName), 'utf8'); //read file

    // upload to pinata 30 times and measure each time performance
    for (let i = 0; i < 30; i++) {
        const start = new Date(); //start timer
        const uploadedFileIPFSpath= await pinataPinningService.writeToPinata(testFolder+fileName); //write file to pinata
        const end = new Date(); //end timer

        //write uploadedFileIPFSpath, writePerformance and size to csv file pinning-service-performance.csv
        const writePerformance = end - start;
        const size = Buffer.byteLength(data, 'utf8') / 1024;
        const writeRes = fs.appendFileSync('./pinata-write-performance-measurements.csv', `${start},pinata,write,${uploadedFileIPFSpath},${size},${writePerformance}\n`); 
        
        //wait 5 seconds till next for loop iteration
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    //wait 10 seconds till next for loop iteration
    await new Promise(resolve => setTimeout(resolve, 10000));
});