const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
require('dotenv').config()
const JWT = process.env.PINATA_API_KEY
const PERSONAL_PINATA_URL = process.env.PERSONAL_PINATA_URL

//src = path to file
const writeToPinata = async (src) => {
    const formData = new FormData();
    
    const file = fs.createReadStream(src)
    formData.append('file', file)
    
    const pinataMetadata = JSON.stringify({
      name: "id-"+Math.random(),
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Authorization': `Bearer ${JWT}`
        }
      });
      return(PERSONAL_PINATA_URL+"/ipfs/"+res.data.IpfsHash);
    } catch (error) {
      return(error);
    }
}


const readFromPinata = (url) => {
    axios.get(
        url
    ).then(
        res => {
            return(res.data)
        }
    ).catch(err=>{
        console.log(err)
        return("ERROR")
    })
}

module.exports = {
    readFromPinata: readFromPinata,
    writeToPinata: writeToPinata
 }
