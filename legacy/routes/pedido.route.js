const express = require("express");
const {
  postPedido,
  getPedidos,
  getPedidosByDni,
  getPedidosByState,
  getPedidosByDate,
  getPedidosByDates,
  getPedidosById,
  updatePedidoById,
  deletePedidoById,
  countPedidos,
} = require("../controllers/pedido.controller");
const verifyToken = require("../middleware/VerifyToken");
const router = express.Router();

router.post("/post",verifyToken ,postPedido);
router.get("/getAll",verifyToken ,getPedidos);
router.get("/getAllByDni/",verifyToken ,getPedidosByDni);
router.get("/getAllByState/:tipo_pedido",verifyToken ,getPedidosByState);
router.get("/getAllUseDate/:fecha_utilizacion",verifyToken ,getPedidosByDate);
router.get("/",verifyToken ,getPedidosByDates);
router.get("/getOne/:id",verifyToken ,getPedidosById);
router.patch("/update/:id",verifyToken ,updatePedidoById);
router.delete("/delete/:id",verifyToken ,deletePedidoById);
router.get("/count",verifyToken ,countPedidos);

module.exports = router;
