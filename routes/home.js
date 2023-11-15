const express = require("express");
const cors =  require('cors');
const router = express.Router();

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "node Express Testing belew",
    message: "This is app is for chapa testing for ewma",
  });
});

module.exports = router;
