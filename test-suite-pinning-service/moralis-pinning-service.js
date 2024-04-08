const Moralis = require("moralis").default;
const axios = require("axios");
require("dotenv").config();

const writeToMoralis = async (data) => {
    try {
        // start Moralis module if not done so far
        if(!Moralis.Core?.isStarted){
            await Moralis.start({
                apiKey: process.env.MORALIS_API_KEY,
            });
        }
        
        // upload file to Moralis IPFS pinning service
        const response = await Moralis.EvmApi.ipfs.uploadFolder({
            abi: [{
                path:"controller-"+Math.random(),
                content:data
            }],
        });
        
        // get path to file in ipfs
        const ipfsLink = response.result[0].path

        // get offical cid of file in ipfs TODO --> not possible through moralis --> work around is to hash the file yourself and use it as a name and store in th path attribute for the uploadF>older function

        // send response to frontend
        if(ipfsLink !== ""){
            res.send(ipfsLink)
        }else{
            res.send("ERROR")
        }
        
    } catch (error) {
        console.log(error)
    }
}

const readFromMoralis = (url) => { //url similar to: https://ipfs.moralis.io:2053/ipfs/QmfLtnKEDUMZtoMH2uN1RXT2Fkx6xFupSLffVFoXa5VsC6/receiving1.json
    axios.get(
        url
    ).then(
        res => {
            console.log(res.data)
        }
    ).catch(err=>{
        console.log(err)
    })
}