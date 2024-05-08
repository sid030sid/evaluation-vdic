const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const app = express();

// enable frontend to call endpoints
app.use(cors());

// For parsing application/json
app.use(express.json());

// use API (= DIC gateway)
const apiRouter = require("./api/routes");
app.use("/dic-gateway", apiRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});