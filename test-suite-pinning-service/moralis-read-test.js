const moralisPinningService = require('./moralis-pinning-service');
const fs = require('fs');
const path = require('path');

//import moralis-write-performance-measurements.csv file and iterate over each line
const data = fs.readFileSync('./moralis-write-performance-measurements.csv', 'utf8').split("\n");
data.forEach(async line => {
    const lineData = line.split(",");
    const start = lineData[0];
    const pinningService = lineData[1];
    const action = lineData[2];
    const ipfsPath = lineData[3];
    const size = lineData[4];
    const performance = lineData[5];

    // read from moralis 30 times and measure each time performance
    for (let i = 0; i < 30; i++) {
        const start = new Date(); //start timer
        const readData = moralisPinningService.readFromMoralis(ipfsPath); //read file from moralis
        const end = new Date(); //end timer

        //check if file was read from moralis
        if(readData === "ERROR"){
            console.log("Error reading from moralis");
        }else{
            //write uploadedFileIPFSpath, writePerformance and size to csv file pinning-service-performance.csv
            const readPerformance = end - start;
            const readRes = fs.appendFileSync('./moralis-read-performance-measurements.csv', `${start},${pinningService},read,${ipfsPath},${size},${readPerformance}\n`); 
            console.log("File successfully read from: ", ipfsPath);
        }

        //wait 5 seconds till next for loop iteration
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    //wait 10 seconds till next for loop iteration
    await new Promise(resolve => setTimeout(resolve, 10000));
});