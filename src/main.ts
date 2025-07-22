import './style.css';

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const app = document.querySelector<HTMLDivElement>("#app")!;

const resultado = await fetch('/dados.json');
const dados = await resultado.json();

const usuarios = dados.usuarios;
const usuario = usuarios.find((u: any) => u.id == id);

if (!usuario) {
  app.innerHTML = "<p>Usuário não encontrado</p>";
} else {
  // Define a cor de fundo do body
  document.body.style.backgroundColor = usuario["cor-body"] || "#fff5f5";

  const container = document.createElement("div");
  container.className = "container";

  if (!usuario.fundo) {
    container.style.backgroundImage = "none";
    container.style.backgroundColor = "white";
  } else if (usuario.fundo.includes("gradient")) {
    container.style.background = usuario.fundo;
  } else if (usuario.fundo.startsWith("/")) {
    container.style.backgroundImage = `url(${usuario.fundo})`;
    container.style.backgroundColor = "";
  } else {
    container.style.backgroundColor = usuario.fundo;
  }

  container.innerHTML = `
    <div class="container-profile" style="color: ${usuario["cor-texto"]};">
      <img src="${usuario.url_foto}" alt="Foto de ${usuario.nome}" />
      <p style="color:${usuario["cor-nome"]}">${usuario.nome}</p>
    </div>
    <div class="container-links">
      ${usuario.links.map((link: any) => `
        <a href="${link.url}" target="_blank"
            style="
              background-color: ${usuario["cor-link"]};
              border: 1px solid ${usuario["link-borda"] || "transparent"};
              border-radius: ${usuario.border_radius};
              color: ${usuario["cor-texto"]};
            "
            onmouseover="this.style.backgroundColor='${usuario["cor-link-hover"] || usuario["cor-link"]}';"
            onmouseout="this.style.backgroundColor='${usuario["cor-link"]}';"
          >
          <img src="${link.icone}" alt="${link.texto}" width="20" />
          ${link.texto}
        </a>
      `).join("")}
    </div>
    <div class="container-qrcode">
      <img src="${usuario.qr}" alt="QR Code de ${usuario.nome}" />
    </div>
  `;

  app.appendChild(container);
}