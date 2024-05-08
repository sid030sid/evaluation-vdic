const pinataPinningService = require('./pinata-pinning-service');
const fs = require('fs');
const path = require('path');

//import pinata-write-performance-measurements.csv file and iterate over each line
const data = fs.readFileSync('./pinata-write-performance-measurements.csv', 'utf8').split("\n");
data.forEach(async line => {
    const lineData = line.split(",");
    const ipfsPath = lineData[3];
    const size = lineData[4];

    // read all 150 files which are 30 versions of the same 5 files in test-data
    
    const start = new Date(); //start timer
    const readData = pinataPinningService.readFromPinata(ipfsPath); //read file from moralis
    const end = new Date(); //end timer
    

    //check if file was read from pinata
    if(readData === "ERROR"){
        console.log("Error reading from moralis");
    }else{   
        //write uploadedFileIPFSpath, writePerformance and size to csv file pinning-service-performance.csv
        const readPerformance = end - start;
        const readRes = fs.appendFileSync('./pinata-read-performance-measurements.csv', `${start},moralis,read,${ipfsPath},${size},${readPerformance}\n`); 
        console.log("File successfully read from: ", ipfsPath);
    }

    //wait 5 seconds till next for loop iteration
    await new Promise(resolve => setTimeout(resolve, 5000));
});