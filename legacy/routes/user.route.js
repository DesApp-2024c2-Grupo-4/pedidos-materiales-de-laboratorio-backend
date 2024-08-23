const express = require("express");
const {
  getUsers,
  getUserById,
  getUser,
  updateUserById,
  deleteUserById,
  getAdminById,
} = require("../controllers/user.controller");
const verifyToken = require("../middleware/VerifyToken");
const router = express.Router();

router.get("/getAll",verifyToken, getUsers);
router.get("/getOne/:id",verifyToken, getUserById);
router.get("/getAdmin/:id",verifyToken, getAdminById);
router.get("/", verifyToken,getUser);
router.patch("/update/:id",verifyToken, updateUserById);
router.delete("/delete/:id",verifyToken, deleteUserById);

module.exports = router;
