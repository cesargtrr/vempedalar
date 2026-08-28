# Plano de Reestruturação do Fluxo Público - VEM PEDALAR

O objetivo deste plano é transformar o formulário de inscrição na página inicial (`/`) do site VEM PEDALAR, removendo a landing page anterior e modernizando a interface do formulário para uma experiência profissional e mobile-first.

## 1. Design do Novo Formulário (Home)
- **Layout Desktop:** Estrutura de duas colunas.
    - **Esquerda:** Elemento visual impactante (logo, imagem do ciclista em estrada/trilha e identidade visual).
    - **Direita:** Formulário de inscrição dentro de um container moderno.
- **Layout Mobile:** Coluna única focada no preenchimento, com cabeçalho compacto.
- **Identidade Visual:** Uso das cores da marca (Azul Céu, Verde Natureza, Amarelo Energia).

## 2. Reorganização das Rotas
- **`src/routes/index.tsx`**: Será atualizado para renderizar diretamente a `RegistrationPage` (atualmente em `/inscricao`).
- **`src/routes/inscricao.tsx`**: Será mantido apenas como um redirecionamento ou renderizando o mesmo componente da home para evitar duplicação.

## 3. Melhorias no Componente de Formulário
- **Cabeçalho:** Adição do logo "VEM PEDALAR" e chamada "Faça sua inscrição e venha pedalar com a gente!".
- **Integração com Configurações:** Garantir que os campos de emergência e termos sejam lidos dinamicamente da tabela `event_settings` (se ainda não estiverem).

## 4. Etapas Técnicas
1.  **Extração de Componentes:** Garantir que o `RegistrationForm` seja robusto e reutilizável.
2.  **Atualização da Home:** Substituir o conteúdo atual da `src/routes/index.tsx`.
3.  **Refatoração do CSS/Tailwind:** Aplicar o novo layout de duas colunas.
4.  **Verificação:**
    - Testar fluxo de inscrição completo.
    - Verificar responsividade mobile.
    - Garantir que `/admin` e sub-rotas não foram afetados.
    - Validar persistência no banco de dados.

## Detalhes Técnicos
- **Frontend:** TanStack Router, Tailwind CSS, Zod (validação), React Hook Form.
- **Backend:** Supabase (armazenamento e configurações).
- **SEO:** Manter meta tags no head() da rota principal.
