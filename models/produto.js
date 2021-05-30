const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var produtoSchema = new mongoose.Schema({
    nome:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    preco:{
        type:Number,
        required:true,
    },
    descricao:{
        type:String,
        required:true,
    },
    permiteAlteracao:{
        type:Boolean,
        default:true, 
    },
    imagem: {
        type: String, // Retona um espaço num armazenamento www.storage.com/produto/imagem.jpeg
        permiteAlteracao: {
            type: Boolean,
            default: false,
        }
    },
});

//Export the model
module.exports = mongoose.model('Produto', produtoSchema);