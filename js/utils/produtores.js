document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("lista-produtores");

  fetch('/terra-mesa/get-produtores.php')
    .then(response => {
      if (!response.ok) throw new Error("Erro ao buscar produtores.");
      return response.json();
    })
    .then(produtores => {
      produtores.forEach(produtor => {
        const card = document.createElement("div");
        card.className = "list-group-item d-flex justify-content-between align-items-center";

        card.innerHTML = `
  <div class="d-flex align-items-center gap-3">
    <img src="${produtor.imagem}" alt="${produtor.nome_loja}" width="50">
    <div>
      <strong>${produtor.nome_loja}</strong><br>
      ${renderStars(produtor.estrelas)} 
      <span class="text-muted"> ${produtor.tipo} • ${produtor.distancia}</span><br>
      <small>${produtor.entrega}</small>
      <br>
          <a href="/terra-mesa/loja.html?id=${produtor.id}" class="btn btn-light mt-2">Ver produtos</a>
    </div>
  </div>
  <i class="bi bi-heart fs-4 text-secondary cursor-pointer favorito-icon" role="button"></i>
`;
        const favoritoIcon = card.querySelector(".favorito-icon");
        favoritoIcon.addEventListener("click", () => {
          favoritoIcon.classList.toggle("bi-heart");
          favoritoIcon.classList.toggle("bi-heart-fill");
          favoritoIcon.classList.toggle("text-danger");
        });

        container.appendChild(card);
      });
    })
    .catch(error => {
      container.innerHTML = "<p class='text-danger'>Erro ao carregar produtores.</p>";
      console.error(error);
    });

    // Carrinho de compras
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("adicionar-carrinho")) {
    const btn = e.target;
    const produto = {
      id: btn.dataset.id,
      nome: btn.dataset.nome,
      preco: parseFloat(btn.dataset.preco),
      imagem: btn.dataset.imagem,
      quantidade: 1
    };

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const existente = carrinho.find(p => p.id === produto.id);

    if (existente) {
      existente.quantidade += 1;
    } else {
      carrinho.push(produto);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
  }
});


  function renderStars(count) {
    return "★".repeat(count) + "☆".repeat(5 - count);
  }
});