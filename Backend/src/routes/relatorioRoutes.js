const express = require("express");

const router = express.Router();

const relatorioController = require(
  "../controllers/relatorioController",
);

router.get(
  "/geral",
  relatorioController.geral,
);

router.get(
  "/individual/:funcionarioId",
  relatorioController.individual,
);

module.exports = router;