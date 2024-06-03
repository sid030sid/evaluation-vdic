
const axios = require("axios")
const fs = require('fs');
const path = require('path');
const testFolder = '../test-data1/';

const secret = "password"


axios.post(
    "http://localhost:3001/gateway/delete", 
    {
        cid: "QmP5m4vxj9uUwrEJG53bPw3X2onwoywqevrGZ2Yzfngoay",
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