document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("lista-produtos");

  function getCategoriaDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("categoria");
  }

  const categoriaSelecionada = getCategoriaDaUrl();

  fetch('/terra-mesa/get-produtos.php')
    .then(res => res.json())
    .then(produtos => {
      const produtosFiltrados = categoriaSelecionada
        ? produtos.filter(p => p.categoria.toLowerCase() === categoriaSelecionada.toLowerCase())
        : produtos;

      if (produtosFiltrados.length === 0) {
        container.innerHTML = "<p class='text-muted'>Nenhum produto encontrado para esta categoria.</p>";
        return;
      }

      produtosFiltrados.forEach(produto => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.descricao}" class="card-img-top mb-2">
          <h5>${produto.descricao}</h5>
          <p class="text-muted">${produto.categoria} • ${produto.quantidade} ${produto.unidade_medida}</p>
          <p class="fw-bold text-success">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
          <div class="d-flex align-items-center gap-2 mb-2">
            <input type="number" min="1" value="1" class="form-control form-control-sm quantidade-produto" 
                   id="qtd-${produto.id}" style="width: 70px;">
            <button class="btn btn-outline-success adicionar-carrinho" 
                    data-id="${produto.id}" 
                    data-nome="${produto.descricao}" 
                    data-preco="${produto.preco}" 
                    data-imagem="${produto.imagem}">
              Adicionar ao carrinho
            </button>
          </div>
        `;

        col.appendChild(card);
        container.appendChild(col);
      });

      container.addEventListener("click", function (e) {
        if (e.target.classList.contains("adicionar-carrinho")) {
          const btn = e.target;
          const produtoId = btn.dataset.id;
          const inputQtd = document.getElementById(`qtd-${produtoId}`);
          const quantidade = parseInt(inputQtd.value) || 1;

          const produto = {
            id: produtoId,
            nome: btn.dataset.nome,
            preco: parseFloat(btn.dataset.preco),
            imagem: btn.dataset.imagem,
            quantidade: quantidade
          };

          let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
          const existente = carrinho.find(p => p.id === produto.id);

          if (existente) {
            existente.quantidade += produto.quantidade;
          } else {
            carrinho.push(produto);
          }

          localStorage.setItem("carrinho", JSON.stringify(carrinho));
          alert(`${produto.quantidade} unidade(s) de ${produto.nome} adicionada(s) ao carrinho!`);
        }
      });
    })
    .catch(err => {
      container.innerHTML = "<p class='text-danger'>Erro ao carregar produtos.</p>";
      console.error(err);
    });
});
