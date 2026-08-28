# Plan - Refatoração Visual e Estrutural Vem Pedalar

Refatorar a plataforma Vem Pedalar para adotar uma estética escura, "suja" e agressiva, focada em trilha e aventura, seguindo exatamente o mockup fornecido. A página principal será uma landing page de página única integrando o formulário de inscrição.

## Design e Identidade Visual

- **Paleta de Cores:**
  - Fundo principal: `#0c0f08` (Verde quase preto)
  - Cards: `#12160c`
  - Seções alternadas: `#2c1c10` (Marrom terra)
  - Destaque: `#c6ff1e` (Verde-limão vibrante)
  - Texto: `#f2efe2` (Bege/Osso)
  - Erro: `#e0693a` (Laranja queimado)
- **Tipografia:**
  - Títulos: Anton (Google Fonts) - Condensada e pesada.
  - Apoio/Tags: Oswald (600-700) - Espaçamento de 2px.
  - Corpo: Inter.
- **Elementos Gráficos:**
  - Botões e faixas com `clip-path` para cortes diagonais.
  - Divisores com efeito de "papel rasgado".
  - Estética mobile-first e responsiva.

## Estrutura da Landing Page (Página Única)

1.  **Header:** Sticky, logo à esquerda, botão "Inscreva-se" diagonal à direita.
2.  **Hero:** Imagem real (`hero-cyclist.jpg`) com gradiente escuro. Título gigante "VEM PEDALAR" (Anton). Tags de "TRILHA · AVENTURA · SUPERAÇÃO".
3.  **Divisor Rasgado:** Transição orgânica entre seções.
4.  **Destaques:** 4 colunas (Natureza, Desafios, Adrenalina, Amigos) com ícones sobre fundo marrom terra.
5.  **Galeria:** Mosaico irregular (estilo Bento/Pinterest) com fotos reais do evento (`adventure-group.jpg`, `community-group.jpg`, etc.).
6.  **Formulário:** Card `#12160c` com borda superior verde-limão. Campos otimizados para mobile. Checkboxes de termos estilizados.
7.  **Faixa Final:** "EM BREVE!" em verde-limão sólido.
8.  **Footer:** Simples e escuro.

## Detalhes Técnicos

- **Global CSS:** Atualizar variáveis de tema no `src/styles.css` para refletir a nova paleta e importar fontes.
- **Componentes:**
  - Criar componente `DiagonalButton` e `TornPaperDivider`.
  - Atualizar `RegistrationForm.tsx` para o novo design (card escuro, bordas verdes, validação com cores terra/laranja).
- **Rotas:**
  - Refatorar `src/routes/index.tsx` para ser a landing page completa descrita.
  - Manter `/admin` funcional com a nova identidade visual.

## Etapas de Implementação

1.  **CSS Foundation:** Configurar cores e fontes no `src/styles.css`.
2.  **Layout & Seções:** Implementar Header, Hero e faixas de destaque no `index.tsx`.
3.  **Galeria & Visual:** Criar o grid de imagens e divisores irregulares.
4.  **Formulário:** Estilizar o formulário existente para se integrar à nova estética.
5.  **Polimento Mobile:** Garantir que todos os elementos de `clip-path` e grades se adaptem corretamente.
