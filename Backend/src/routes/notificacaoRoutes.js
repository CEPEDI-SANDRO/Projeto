const express = require("express");

const router = express.Router();

const notificacaoController = require(
  "../controllers/notificacaoController",
);

router.get(
  "/listar",
  notificacaoController.listar,
);

module.exports = router;