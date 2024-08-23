const express = require("express");
const {
  crearMaterial,
  getMaterial,
  getMateriales,
  getMaterialById,
  updateMaterialById,
  deleteMaterial,
} = require("../controllers/material.controller");
const verifyToken = require("../middleware/VerifyToken");
const router = express.Router();

router.post("/post",verifyToken ,crearMaterial);
router.get("/",verifyToken ,getMaterial);
router.get("/getAll",verifyToken ,getMateriales);
router.get("/getOne/:id",verifyToken ,getMaterialById);
router.patch("/update/:id",verifyToken ,updateMaterialById);
router.delete("/delete/:id",verifyToken ,deleteMaterial);

module.exports = router;
