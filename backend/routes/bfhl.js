const express = require("express");
const { processBFHL } = require("../utils/graph");

const router = express.Router();

router.post("/", (req, res) => {
    try {
        const result = processBFHL(req.body.data || []);
        res.json(result);
    } catch (err) {
        res.status(500).json({
            error: "Invalid input or server error"
        });
    }
});

module.exports = router;