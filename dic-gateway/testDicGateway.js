const axios = require("axios")

const toBeUploadedJson = {
    "hey": "this",
    "is": "a",
    "test": "ok?!"
}

const testUploadAndDownloadToDic = () => {

    // write file from DIC
    axios.post("http://localhost:3001/dic-gateway/write/", {file : toBeUploadedJson})
    .then(res => {
        console.log(res.data)
    }).catch(err => {
        console.log(err)
    })

    // read file from DIC
    axios.get("http://localhost:3001/dic-gateway/read/123456")
    .then(res => {
        console.log(res.data)
    }).catch(err => {
        console.log(err)
    })
}

testUploadAndDownloadToDic()