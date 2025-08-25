# Movie Database App

Este projeto é um site completo para explorar filmes, criar sua própria lista de favoritos, avaliar títulos e buscar informações detalhadas sobre cada obra.

## Funcionalidades

- **Listagem de lançamentos**: Veja os filmes mais recentes e populares na página principal.
- **Infinite scroll**: Role a página para carregar mais filmes automaticamente.
- **Busca avançada**: Filtre filmes por nome, ano, gênero, ator/atriz e diretor/diretora.
- **Página de detalhes**: Clique em um filme para ver sinopse, nota, elenco, trailer (YouTube), avaliações de usuários e link para Letterboxd.
- **Minha Lista (Watchlist)**: Adicione filmes à sua lista pessoal, visualizando-os com destaque e ícone de relógio.
- **Cadastro de usuário**: Crie uma conta local para simular autenticação.
- **Avaliações**: Escreva e visualize reviews dos filmes, salvos localmente.
- **Alternância de tema**: Escolha entre modo claro e escuro em qualquer página.
- **Responsividade**: Layout adaptado para desktop, tablet e smartphone.

## Como usar

1. Abra o arquivo `index.html` em seu navegador.
2. Para funcionalidades que usam a API TMDb, insira sua chave em `script.js` e `movie.js`:
   ```js
   const TMDB_API_KEY = 'SUA_TMDB_API_KEY';
   ```
3. Navegue pelo site, busque filmes, adicione à sua lista, avalie e explore os detalhes.

## Estrutura do projeto

Hierarquia dos arquivos (do mais importante para o funcionamento do site):

1. `index.html` — Página principal, ponto de entrada do site e navegação.
2. `script.js` — Lógica da página principal: busca, filtros, exibição de filmes e watchlist.
3. `movie.html` — Página de detalhes do filme, exibe informações completas, trailer, reviews e integração com a watchlist.
4. `movie.js` — Lógica da página de detalhes: busca de dados, trailer, elenco, reviews e botão de lista.
5. `style.css` — Estilos globais, responsividade, temas claro/escuro.
6. `theme.js` — Alternância entre modo claro e escuro.
7. `signup.html` — Página de cadastro de usuário.
8. `signup.js` — Lógica do cadastro de usuário local.
9. `README.md` — Documentação do projeto.

## APIs utilizadas

- [The Movie Database (TMDb)](https://developers.themoviedb.org/3)
- [OMDb/IMDB](http://www.omdbapi.com/) (opcional)
- [Letterboxd](https://letterboxd.com/) (link de busca)

## Observações

- O site funciona 100% localmente, sem backend.
- Os dados de usuário, lista e avaliações são salvos no navegador (LocalStorage).
- Para exibir trailers e informações completas, é necessário configurar sua chave TMDb.

Passo a passo para configuração de sua chave TMDb:
- Acesse: https://www.themoviedb.org/signup e crie uma conta.
- Após o login, vá em: https://www.themoviedb.org/settings/api
- Clique em “Create” para gerar uma nova chave de API.
Preencha os dados solicitados (pode ser uso pessoal/educacional).
- Após aprovação, sua chave estará disponível na página de API Keys.
- Copie a chave e substitua 'SUA_TMDB_API_KEY' nos arquivos script.js e movie.js pelo valor recebido.

## Licença

Este projeto é livre para uso e modificação.
