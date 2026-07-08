# Como levar esta home para WordPress

Esta entrega e um frontend estatico: `index.html`, `styles.css`, `app.js` e imagens locais em `assets/`.

Isso serve para validar visual, responsividade e interacoes. Para substituir paginas do WordPress em producao, existem tres caminhos comuns:

1. **Pagina HTML dentro do WordPress**
   - Mais rapido para testar.
   - O CSS e o JS podem entrar no tema atual ou em um plugin de snippets.
   - Nao integra sozinho com produtos reais, carrinho real ou checkout.

2. **Tema filho/custom template**
   - Melhor quando voce quer manter o WordPress, mas trocar o visual da home.
   - O HTML vira um template PHP.
   - O CSS e o JS sao carregados pelo `functions.php`.

3. **WooCommerce**
   - Melhor caminho para ecommerce funcional.
   - Os cards de produto deixam de vir do array no `app.js` e passam a vir do catalogo WooCommerce.
   - Carrinho, checkout, estoque, variacoes, frete e pagamentos ficam no WordPress/WooCommerce.

Minha recomendacao para este projeto: usar esta versao como prototipo fiel e, no proximo passo, transformar os cards em dados vindos do WooCommerce. Assim voce preserva a aparencia do Figma e ganha ecommerce real sem reinventar carrinho, pagamento e estoque.
