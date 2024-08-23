const express = require("express");
const {
  crearReactivo,
  getReactivo,
  getReactivos,
  getReactivosById,
  updateReactivoById,
  deleteReactivoById,
} = require("../controllers/reactivo.controller");
const verifyToken = require("../middleware/VerifyToken");
const router = express.Router();

router.post("/post",verifyToken , crearReactivo);
router.get("/",verifyToken , getReactivo);
router.get("/getAll",verifyToken ,getReactivos);
router.get("/getOne/:id",verifyToken ,getReactivosById);
router.patch("/update/:id",verifyToken ,updateReactivoById);
router.delete("/delete/:id",verifyToken ,deleteReactivoById);

module.exports = router;
