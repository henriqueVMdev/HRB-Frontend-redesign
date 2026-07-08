# Integracao WordPress / WooCommerce

O projeto agora tem duas camadas:

- Prototipo estatico na raiz: `index.html`, `styles.css`, `app.js` etc.
- Tema WooCommerce em `wordpress/hrb-imports-theme`.

O pacote instalavel esta em `wordpress/hrb-imports-theme.zip`.

## Como instalar

1. No WordPress, va em `Aparencia > Temas > Adicionar novo > Enviar tema`.
2. Envie `wordpress/hrb-imports-theme.zip`.
3. Ative o tema `HRB Imports WooCommerce`.
4. Garanta que o plugin WooCommerce esteja ativo.
5. Em `Configuracoes > Leitura`, defina a pagina inicial se quiser usar a home customizada.
6. Em `WooCommerce > Configuracoes > Avancado`, confira se as paginas Carrinho, Finalizar compra e Minha conta estao configuradas.

## Dados que o tema usa

Produtos vem do catalogo WooCommerce. Para deixar os cards completos, o tema tenta ler:

- SKU nativo do WooCommerce.
- Imagem principal e galeria nativas do produto.
- Categorias nativas do produto.
- Atributos globais `pa_marca`, `pa_modelo` e `pa_ano` para filtros.
- Metadado `_hrb_oem` para codigo OEM.
- Metadado `_hrb_card_tag` para a etiqueta amarela do card.
- Metadado `_hrb_pix_price` para preco Pix.
- Metadado `_hrb_aplicacoes` com uma aplicacao por linha na pagina de produto.

Se algum campo estiver vazio, o tema usa fallback visual para nao quebrar a pagina.
