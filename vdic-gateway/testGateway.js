const axios = require("axios")

const secret = "password"

const toBeUploadedJson = {
    "hey": "this",
    "is": "a",
    "test": "ok?!"
}

const testUploadAndDownloadToVdic = () => {

    // write file from DIC
    axios.post(
        "http://localhost:3001/gateway/write", 
        {
            file : toBeUploadedJson,
        },
        {
            headers: {
                'Authorization': 'Basic ' + secret
            }
        }
    )
    .then(res => {
        console.log(res.data)
    }).catch(err => {
        console.log(err)
    })

    // read file from DIC
    axios.get(
        "http://localhost:3001/gateway/read/123456",
        {
            headers: {
                'Authorization': 'Basic ' + secret
            }
        }
    )
    .then(res => {
        console.log(res.data)
    }).catch(err => {
        console.log(err)
    })
}

testUploadAndDownloadToVdic()