// Criado por: André Ricardo Marques Rogério
//
//    App.js
//    Aplicação em React que exibe as informações consumida da API e age como um CRUD,
//    permitindo a adição, remoção, edição e pesquisa dos itens.
//

import React, { Component } from "react";

import indexStyles from "./assets/indexStyles.js";

// Componentes do Material-UI
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class App extends Component {
  state = {
    response: [],
    data: [],
    menuOpened: false,
    edit: false
  };

  // Ao terminar de carregar o componente, chama a API para obter os dados do database.
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res, data: res }))
      .catch(err => console.log(err));
  }

  // Chamada da API na rota /api/cardapio
  callApi = async () => {
    const response = await fetch("/api/cardapio");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  showMenu = () => {
    const { menuOpened } = this.state;
    this.setState({ menuOpened: !menuOpened });
  };

  addItem = () => {
    const { data, menuOpened } = this.state;
    const temp = {
      title: this.state.title,
      price: this.state.price,
      description: this.state.desc
    };

    data.push(temp);
    this.showMenu();
    this.setState({ title: "", price: "", desc: "" });
  };

  // Deleta itens da lista de cardápio:
  //  in:
  //   id: id do item a ser deletado
  // temp contém a lista de itens com o item já deletado.
  deleteFunction = id => {
    const temp = this.state.data.filter(function(value, index, arr) {
      return index !== id;
    });
    this.setState({
      data: temp,
      response: temp
    });
  };

  // Interação quando o usuário clica no botão de editar do item
  //   in:
  //    id: id do item a ser editado
  //
  // Os dados de título, preço, descrição e id são armazenados em states para serem
  // utilizados na função editItem. Além disso, abre o menu de editar/adicionar item.
  editFunction = id => {
    const { data } = this.state;

    this.setState({ edit: true, id: id });
    this.showMenu();
    this.setState({
      title: data[id].title,
      price: data[id].price,
      desc: data[id].description
    });
  };

  // Edita o item que o usuário selecionou.
  //
  // Ativado quando o usuário clica no botão "Editar". Atualiza os dados do item
  // selecionado com os novos valores inseridos pelo usuário.
  editItem = () => {
    const { data, title, price, desc, id } = this.state;
    this.showMenu();
    this.setState({
      edit: false
    });
    const temp = data;
    console.log(temp[0], id);
    temp[id].title = title;
    temp[id].price = price;
    temp[id].description = desc;
    this.setState({
      data: temp,
      title: "",
      price: "",
      desc: ""
    });
  };

  // Funções que tratam dos TextFields.
  handleTitleChange = e => {
    this.setState({
      title: e.target.value
    });
    console.log(this.state.title);
  };
  handlePriceChange = e => {
    this.setState({
      price: e.target.value
    });
    console.log(this.state.textPrice);
  };
  handleDescChange = e => {
    this.setState({
      desc: e.target.value
    });
    console.log(this.state.textDesc);
  };

  // Lida com o TextField de pesquisa.
  handleSearch = e => {
    const searchTerm = e.target.value;
    this.setState({ searchTerm });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (searchTerm.length > 0) {
        this.loadSearch();
      } else {
        this.resetList();
      }
    }, 200);
  };

  // Função de busca.
  //
  // Busca simples por letras digitadas. Recebe o valor digitado e compara com as entradas
  // da base procurando por similaridades. Atualiza a cada 200ms.
  loadSearch = async () => {
    const { searchTerm, data } = this.state;

    var results = data.filter(item => {
      if (item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        return item;
      }
    });

    this.setState({ data: results });
    console.log(`Sua busca para o resultado ${searchTerm} retornou 10 termos`);
  };

  // Reseta a base para seu estado antes da busca.
  resetList = () => {
    this.setState({ data: this.state.response });
  };

  render() {
    const data = this.state.data;

    return (
      <div
        className="App"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh"
        }}
      >
        <div>
          <h1>Cardápio</h1>
          {/* Lista dos itens da base */}
          <List
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "55vh"
            }}
          >
            {/* Verifica se a base "data" está vazia. Se estiver, retorna "vazio" */}
            {data !== []
              ? data.map((value, id) => {
                  return (
                    <ListItem
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "55vh"
                      }}
                    >
                      <ListItemText
                        key={id}
                        primary={value.title + ` - ` + value.price}
                        secondary={value.description}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <EditIcon
                            onClick={this.editFunction.bind(this, id)}
                          />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon
                            onClick={this.deleteFunction.bind(this, id)}
                          />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })
              : "vazio"}
          </List>
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "0 16px 0 16px" }}
          onClick={this.showMenu}
        >
          Novo Item
        </Button>
        <div>
          <TextField
            variant="outlined"
            label="Pesquisar item"
            style={{ width: "100%", marginBottom: "16px" }}
            onChange={this.handleSearch}
          ></TextField>
          <div
            style={
              this.state.menuOpened
                ? indexStyles.addMenuOpen
                : indexStyles.addMenuHidden
            }
          >
            <TextField
              variant="outlined"
              label="Título"
              value={this.state.title}
              onChange={this.handleTitleChange}
              style={indexStyles.textField}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              variant="outlined"
              label="Preço"
              value={this.state.price}
              onChange={this.handlePriceChange}
              style={indexStyles.textField}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              variant="outlined"
              label="Descrição"
              value={this.state.desc}
              onChange={this.handleDescChange}
              multiline
              style={indexStyles.textField}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={this.state.edit ? this.editItem : this.addItem}
            >
              {this.state.edit ? "Editar" : "Adicionar"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
