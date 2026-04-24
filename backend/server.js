const express = require("express");
const cors = require("cors");
const path = require("path");

const bfhlRoute = require("./routes/bfhl");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/bfhl", bfhlRoute);


app.use(express.static(path.join(__dirname, "../frontend")));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});