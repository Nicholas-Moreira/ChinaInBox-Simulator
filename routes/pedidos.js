const express = require("express");
const Pedido = require("../models/pedido");
const Produto = require("../models/produto");
const router = express.Router();

// Obter todos os pedidos
router.get("/", function (req, res) {
  Pedido.find({
    //nome: /Yakissoba.*/i, // O "i" faz a pesquisa virar case insensitive
    // preco: { $gt: 30.99 },
    // nome: { $in: ["Yakissoba"] },
    // nome: { $in: [/Yakissoba.*/, /Frango.*/] },
  }, { "__v" : 0 }).populate("lista.idProduto")
  .then((doc) => {
    console.log(doc);
    res.send(doc);
  })
  .catch((err) => {
    console.log(err);
    next(err);
  });
});

// Cadastrar novo pedido
router.post("/", async function (req, res, next) {
  const { nomeUsuario, lista } = req.body;
  console.log(req.body);
  const listaIdProduto = lista.map((elem) => {
    return elem.idProduto;
  });
  const totalEncontrados = await Produto.countDocuments({
    _id: { $in: listaIdProduto },
  });
  if (listaIdProduto.length != totalEncontrados) {
    res.status(406).send({ mensagem: "Produtos nao encontrados!" });
    return;
  }

  var jsonObject = {"now":"new Date()"};
  var dataAgora = eval(jsonObject.now);
  let pedido = new Pedido({
    nomeUsuario: nomeUsuario,
    data: dataAgora,
    lista: lista,
  });

  try {
    const { nomeUsuario, lista } = req.body;
      await pedido.save().then((doc) => {
        console.log(doc);
        res.send({ produto: doc });
      })
  }
  catch (err) {
    console.error(err);
    if (error.name === "MongoError" && err.code === 11000) {
      res.status(409).send({ mensagem: "Pedido ja existente!", erro: err.message });
    } else {
      next(err);
    }
  }
});

router.delete("/:idPedido", (req, res) => {
  const { idPedido } = req.params;

  Pedido.findByIdAndRemove(idPedido, function(err) {
    if (err)
      res.send(err);
    else
      res.json({ message: 'Pedido removido'});
  });
});

router.get("/:idPedido", async (req, res) => {
  const { idPedido } = req.params;
  try {
    const doc = await Pedido.findById(idPedido);  // Formato da requisição GET: localhost:3000/pedidos/6088b9ad88277625e6aa1d01
    res.send(doc);
  }
  catch(err) {
    console.log(`Erro final: ` + err);
    res.send(err);
  }
});

module.exports = router; // expoe para todos que importar ese arquivo os endpoint 