const express = require("express");
const cors =  require('cors');
const router = express.Router();
router.use(cors())
router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "node Express Testing",
    message: "This is app is for chapa testing for ewma",
  });
});

module.exports = router;
