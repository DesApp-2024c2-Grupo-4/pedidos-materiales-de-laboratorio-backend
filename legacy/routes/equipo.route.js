const express = require("express");
const {
  crearEquipo,
  getEquipo,
  getEquipos,
  getEquipoById,
  updateEquipoById,
  deleteEquipoById,
} = require("../controllers/equipo.controller");
const verifyToken = require("../middleware/VerifyToken");
const router = express.Router();

router.post("/post",verifyToken ,crearEquipo);
router.get("/",verifyToken ,getEquipo);
router.get("/getAll",verifyToken ,getEquipos);
router.get("/getOne/:id",verifyToken ,getEquipoById);
router.patch("/update/:id",verifyToken ,updateEquipoById);
router.delete("/delete/:id",verifyToken ,deleteEquipoById);

module.exports = router;
