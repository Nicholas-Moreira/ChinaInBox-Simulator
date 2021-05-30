const mongoose = require('mongoose'); // Erase if already required

var produtoSubSchema = new mongoose.Schema({
    idProduto: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Produto"
    },
                qtd: {
                type:Number,
                default: 1
            },
            comentario:String,
})

// Declare the Schema of the Mongo model
var pedidoSchema = new mongoose.Schema({
    data:{
        type:Date,
        default:Date.now
    },
    nomeUsuario:{
        type:String,
        required:true,
    },
    lista:[
        {
            qtd: {
                type:Number,
                default: 1
            },
            idProduto: {
                type: mongoose.Schema.Types.ObjectId, ref: "Produto"
            },
            comentario:String,
        }
    ]
});

//Export the model
module.exports = mongoose.model('Pedido', pedidoSchema);