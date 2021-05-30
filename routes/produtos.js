const express = require("express");
const router = express.Router();

// Schema = primeira letra em maiusculo
// importa o que esta sendo exportado no models
const Produto = require("../models/produto");
// Tudo que estiver no router será exposto para qq um que exporte esse arquivo
// nao vamos mais utilizar o express, mas a rota do express!

//Export the model
//module.exports = mongoose.model('User', userSchema);

router.post('/exemplo', async function (req, res) {
    const { chave, numero, preco} = req.headers;  // Dados obtidos do header
    const { ordenacao, pagina } = req.query; // Dados passados na URL (params)
    const { nome, descricao, outracoisa } = req.body; // Dados obtidos do body

    console.log(`\nParametros no headers do POST: Chave: ${chave} Numero: ${numero} Preco: ${preco}`);
    console.log(`\nParametros na URL do POST: Ordenacao: ${ordenacao} Pagina: ${pagina}.`); // localhost:3000/produtos/exemplo?ordenacao=asc&pagina=120
    console.log(`\nParametros no body do POST: Produto: ${nome} Descricao: ${descricao} Outracoisa: ${outracoisa}`);
    console.log(req.body); // Esse aparece... funciona por causa do app.use(express.json());
    console.log("Parametros passados na variavel req.body (não aparece): " + req.body); // Esse não aparece
    console.log(`Também não aparece: ${req.body}`); // Esse também não

    res.status(201).send(`Resposta ao POST para o status code 201 (sucesso)!`); // Aparece no body da resposta
});

// Vamos usar o GET para buscar uma lista ou elemento
router.get("/", function (req, res) {
  Produto.find({
    //nome: /Yakissoba.*/i, // O "i" faz a pesquisa virar case insensitive
    // preco: { $gt: 30.99 },
    // nome: { $in: ["Yakissoba"] },
    // nome: { $in: [/Yakissoba.*/, /Frango.*/] },
  }, { "__v" : 0 }) // Tirar a versao do mongoose das respostas
    .then((doc) => {
      console.log(doc);
      res.send(doc);
    })
    .catch((err) => {
      console.log(`Erro final: ` + err);
      next(err);
    });
});

router.post("/", async function (req, res, next) {
  let produto = new Produto({  // Essa informação vai escrita no body do POST, em formato raw (como json)
    nome: req.body.nome,
    preco: req.body.preco,
    descricao: req.body.descricao,
    imagem: req.body.imagem,
    permiteAlteracao: req.body.permiteAlteracao,
  });

  try {
    await produto.save().then((doc) => {
      //console.log(doc);
      res.send({ produto: doc });
    })
  }
  catch (err) {
    console.error(err);
    if (error.name === "MongoError" && err.code === 11000) {
      res.status(409).send({ mensagem: "Produto ja existente!", erro: err.message });
    } else {
      next(err);
    }
  }
});

router.patch("/:idProduto", (req, res) => {   // O id do produto a ser alterado vai pela URL, mas os campos a serem alterados vão pelo body do PATCH
  const { idProduto } = req.params;           // Formato da requisição PATCH: localhost:3000/produtos/609ffe4ae8f82c441c12b003
  const updateParams = {};

  const { nome, preco, descricao } = req.body;
  console.log(`\nParametros no body\n=> Preco: ${preco}\n=> Nome: ${nome} \n=> Descricao: ${descricao}` );
  console.log(req.body);
  
  for (const param of Object.keys(req.body)) {  
    //console.log(param); 
    updateParams[param] = req.body[param];
  }

  Produto.updateOne({ _id: idProduto }, { $set: updateParams })
  .then((doc) => {
    //console.log(doc);
    res.status(204).send();
  })
  .catch ((err) => {
    console.log(err);
    next(err);
  });
});

router.get("/:idProduto", async (req, res) => {
  const { idProduto } = req.params;
  try {
    const doc = await Produto.findById(idProduto);  // Formato da requisição GET: localhost:3000/produtos/6088b9ad88277625e6aa1d01
    res.send(doc);
  }
  catch(err) {
    console.log(`Erro final: ` + err);
    res.send(err);
  }
});

router.delete("/:idProduto", (req, res) => {
  const { idProduto } = req.params;
  //Produto.findOneAndRemove( { '_id':idProduto } );

  Produto.findByIdAndRemove(idProduto, function(err) {
        if (err)
            res.send(err);
        else
            res.json({ message: 'Produto removido'});
  });
});

module.exports = router; // module.exports=router está mapeando um router e toda a lógica requerida para mapear /produtos. 
                          // Se for removido, sua declaração não poderá adquirir um objeto exportado desse módulo, e irá falhar.
