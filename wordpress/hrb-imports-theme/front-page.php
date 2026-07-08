<?php
if (!defined('ABSPATH')) {
    exit;
}

get_header();

$shop_url = hrb_wc_active() ? wc_get_page_permalink('shop') : home_url('/');
$popular_products = hrb_get_products(['limit' => 8, 'orderby' => 'popularity']);
$sale_products = hrb_get_products(['limit' => 8, 'on_sale' => true]);
if (empty($sale_products)) {
    $sale_products = hrb_get_products(['limit' => 8, 'orderby' => 'date']);
}
$categories = hrb_wc_active() ? get_terms([
    'taxonomy' => 'product_cat',
    'hide_empty' => true,
    'number' => 7,
]) : [];
?>

<main id="inicio">
  <section class="hero" aria-label="Destaque principal">
    <img class="hero-image" src="<?php echo hrb_asset('assets/hero-banner.png'); ?>" alt="Buchas para bracos e bandejas HRB Imports" />
  </section>

  <section class="search-shell" aria-label="Busca de pecas">
    <form class="part-search" role="search" method="get" action="<?php echo esc_url($shop_url); ?>">
      <label class="full-field">
        <span>Nome da peca ou codigo original</span>
        <input name="s" type="search" placeholder="Ex: Turbocharger Garrett GT35" />
        <input type="hidden" name="post_type" value="product" />
      </label>
      <label>
        <span>Marca</span>
        <select name="filter_marca">
          <option value="">Todas</option>
          <option>BMW</option>
          <option>Mercedes-Benz</option>
          <option>Audi</option>
          <option>Volkswagen</option>
        </select>
      </label>
      <label>
        <span>Modelo</span>
        <select name="filter_modelo">
          <option value="">Todos</option>
          <option>320i</option>
          <option>X1</option>
          <option>C180</option>
          <option>A3</option>
          <option>Jetta</option>
        </select>
      </label>
      <label>
        <span>Ano</span>
        <select name="filter_ano">
          <option value="">Todos</option>
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
          <option>2021</option>
          <option>2020</option>
        </select>
      </label>
      <button class="primary-button" type="submit"><span>Buscar</span></button>
    </form>
  </section>

  <section class="trust-row" aria-label="Beneficios">
    <article><span class="benefit-icon">OEM</span><strong>Peca certa no fit</strong><small>Validacao por codigo original</small></article>
    <article><span class="benefit-icon">NF</span><strong>Nota fiscal</strong><small>Garantia de procedencia</small></article>
    <article><span class="benefit-icon">24h</span><strong>Envio em ate 24h</strong><small>Todo o Brasil</small></article>
    <article><span class="benefit-icon">VIP</span><strong>Oficinas e lojistas</strong><small>Condicoes especiais</small></article>
  </section>

  <section class="section-wrap categories-section" id="categorias">
    <div class="section-title">
      <span></span>
      <h1>Categorias em Destaque</h1>
    </div>
    <div class="category-grid" aria-label="Categorias de produto">
      <?php if (!is_wp_error($categories) && !empty($categories)) : ?>
        <?php foreach ($categories as $category) : ?>
          <a href="<?php echo esc_url(get_term_link($category)); ?>"><?php echo esc_html($category->name); ?></a>
        <?php endforeach; ?>
      <?php else : ?>
        <a href="<?php echo esc_url($shop_url); ?>">Suspensao</a>
        <a href="<?php echo esc_url($shop_url); ?>">Pastilhas de Freio</a>
        <a href="<?php echo esc_url($shop_url); ?>">Amortecedores</a>
        <a href="<?php echo esc_url($shop_url); ?>">Velas de Ignicao</a>
        <a href="<?php echo esc_url($shop_url); ?>">Bombas de Combustivel</a>
        <a href="<?php echo esc_url($shop_url); ?>">Mangueiras</a>
        <a href="<?php echo esc_url($shop_url); ?>">Discos de Freio</a>
      <?php endif; ?>
      <a href="<?php echo esc_url($shop_url); ?>">Ver Mais</a>
    </div>
  </section>

  <?php hrb_product_band('Mais Vendidos', $popular_products); ?>

  <section class="feature-split">
    <div class="feature-copy">
      <p>A suspensao e um dos sistemas mais criticos do seu veiculo e qualquer componente fora do ponto compromete a dirigibilidade e a seguranca. Na HRB Imports, voce encontra bracos, bandejas, buchas, terminais e muito mais, com qualidade garantida.</p>
      <a class="secondary-button" href="<?php echo esc_url($shop_url); ?>">Ver mais</a>
    </div>
    <img src="<?php echo hrb_asset('assets/banner-suspensao.png'); ?>" alt="Componentes de suspensao premium" />
  </section>

  <?php hrb_product_band('Promocoes', $sale_products); ?>

  <section class="delivery-block" id="atendimento">
    <img src="<?php echo hrb_asset('assets/delivery.png'); ?>" alt="Carrinho com pecas automotivas HRB Imports" />
    <p>Na HRB Imports, a gente entende que tempo e dinheiro. Por isso, todos os pedidos sao processados com agilidade, embalados com cuidado e despachados com rastreamento completo.</p>
  </section>
</main>

<?php get_footer(); ?>
