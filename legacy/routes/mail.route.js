const express = require("express");
const {
  getMails,
  sendMail,
  deleteMail,
  updateMails,
} = require("../controllers/mail.controller");
const verifyToken = require("../middleware/VerifyToken");
const router = express.Router();

router.get("/mails/:id", verifyToken, getMails);
router.post("/send", verifyToken, sendMail);
router.put("/update", verifyToken, updateMails);
router.delete("/delete/:id", verifyToken, deleteMail);

module.exports = router;
