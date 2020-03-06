// Criado por: André Ricardo Marques Rogério
//
//    server.js
//    API em Express que envia os dados do database para o cliente, a aplicação em React
//    Utiliza a porta 5000
//

const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

var productsCollection = [
  {
    title: "Isca de Calabresa",
    price: "R$ 20,90",
    description: "Calabresa em fatias com cebola, azeitonas e fatias de pão."
  },
  {
    title: "Isca de Picanha",
    price: "R$ 37,90",
    description:
      "170g de Picanha ao molho da casa com cebola , pimentão, azeitonas e Pão de Alho assado."
  },
  {
    title: "Mix Mix",
    price: "R$ 34,90",
    description:
      "Picanha Tradicional no Bafo, Queijo Coalho assado, Linguiça Toscana e Pão de Alho, Sensacional para beliscar!"
  },
  {
    title: "Banana Frita",
    price: "R$ 11,00",
    description: "Banana Frita com açúcar e canela."
  },
  {
    title: "Banana á Milanesa",
    price: "R$ 13,00",
    description: ""
  },
  {
    title: "Batata Frita",
    price: "R$ 16,00",
    description: ""
  },
  {
    title: "Bolinho de Bacalhau (2 unidades)",
    price: "R$ 9,00",
    description: ""
  },
  {
    title: "Bolinho de macaxeira (6 unidades)",
    price: "R$ 14,00",
    description: ""
  }
];

module.exports = {
  products: productsCollection
};

app.get("/api/cardapio", (req, res) => {
  res.send(productsCollection);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
