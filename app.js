const express = require("express"); // Importa o módulo express
const mongoose = require ("mongoose");
const dotenv = require("dotenv");

const produtoRoutes = require("./routes/produtos");
const pedidoRoutes = require("./routes/pedidos");

const app = express(); 
// a contante app cria uma instancia (cópia) inteira do framework express
// qualquer coisa do express que eu preciar vou usar a partir da constante app
// pode ser uma variavel, mas usamos uma contante para não ser possivel reescrever 
// essa variavel. Isso deixa a aplicação mais segura.
const port = process.env.PORT || 3000;

// Rotas são desvios de execução, que levam a aplicação para outros caminhos
// VEJA! O express é um framework orientado a rotas!
// Isso é uma rota
app.get("/sobre", function(req, res){
    res.send("Minha primeira aplicação backend! By Nicholas Moreira")
})

// Passagem de parametros
app.get("/sobre/:nome/:funcao/:cor", function(req, res){
    //res.send(req.params);
    res.send("<h1> Ola " + req.params.nome + "</h1>"+"<h2> Sua funcao é " + req.params.funcao + "</h2>"+"<h3> Sua cor favorita é " + req.params.cor + "</h3>");
    res.send("<h2> Essa parte não sera exibida, pois SEND só pode ser enviado uma unica vez! </h2>"); 
})

app.use(express.json()); // Middleware que transforma o req.body em json para todas as rotas
                         // Equivale a JSON.stringfy(req.body);
app.use(express.urlencoded({ extended: true })); // extended permite escolher entre fazer parse dos dados na URL com a biblioteca querystring (false) or com a qs (when true).

const mongoURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.8awkq.mongodb.net/${process.env.MONGO_DB_NAME}??authSource=admin&replicaSet=atlas-wb3443-shard-0&readPreference=primary&ssl=true`;
mongoose.connect(
    mongoURL, 
    { // facilitadores do banco de dados
        useNewUrlParser: true,
        useCreateIndex: true,  
        useUnifiedTopology: true,
    },
(error) => {
    if (error)
        console.log("Falha ao conectar ao MONGODB\n\n");
    else 
        console.log("Conectado ao MONGODB\n\n");
});

app.use("/", (req, res, next) => {  // O / vem primeiro que o /produtos. Podemos criar uma regra aqui, contar requisicoes, etc
    //console.log("Acabo de receber uma uma requisição. Estou passando pelo middleware app.use /.");
    //res.setHeader("Este-eh-um-exemplo-de-KEY-HEADER-setado-no-Middleware", "E esta é a informacao que o mesmo carrega.");
    next(); // Tem que ter o next, senão para aqui e nao segue adiante no codigo
});

app.get("/", (req, res) => 
{
    console.log("Recebi uma requisição GET para a raiz");
    res.status(201).send({ mensagem: "Esta é uma mensagem de resposta ao evento 201" });

    const { idProduto } = req.params;
    res.send({
        mensagem: idProduto,
    })
});

app.use("/produtos", produtoRoutes); // apenas EPs que iniciam com /produtos
app.use("/pedidos", pedidoRoutes); // apenas EPs que iniciam com /pedidos

// Criaremos um servidor baseado no express. 
// IMPORTANTE: O listen deve ser a última instrução do código!
app.listen(port, () => { 
  console.log(`App iniciou na porta ${port}!`);
  console.log(`Dados do MONGODB:\n- USER: ${process.env.MONGO_USER}\n- DATABASE: ${process.env.MONGO_DB_NAME}`)
});

