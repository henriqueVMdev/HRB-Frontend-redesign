<?php
if (!defined('ABSPATH')) {
    exit;
}

get_header();
$shop_url = hrb_wc_active() ? wc_get_page_permalink('shop') : home_url('/');
$terms = get_terms(['taxonomy' => 'product_cat', 'hide_empty' => true]);
?>

<main class="results-layout">
  <aside class="filter-sidebar" aria-label="Filtros">
    <form class="filter-form" method="get" action="<?php echo esc_url($shop_url); ?>">
      <label class="filter-field">
        <span>Busca</span>
        <input type="search" name="s" value="<?php echo esc_attr(get_search_query()); ?>" placeholder="Trocador de Calor" />
        <input type="hidden" name="post_type" value="product" />
      </label>

      <section class="filter-panel">
        <h2>Filtros</h2>
        <label class="filter-field">
          <span>Montadora</span>
          <select name="filter_marca">
            <option value="">Marca</option>
            <option>BMW</option>
            <option>Mercedes-Benz</option>
            <option>Audi</option>
            <option>Volkswagen</option>
          </select>
        </label>
        <img class="filter-brand-logo" src="<?php echo hrb_asset('assets/filter-bmw-logo.svg'); ?>" alt="BMW" />

        <label class="filter-field">
          <span>Modelo</span>
          <select name="filter_modelo">
            <option value="">Selecione Modelo</option>
            <option>320i</option>
            <option>X1</option>
            <option>C180</option>
            <option>A3</option>
          </select>
        </label>
        <label class="filter-field">
          <span>Ano</span>
          <select name="filter_ano">
            <option value="">Selecione Ano</option>
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
            <option>2021</option>
          </select>
        </label>

        <fieldset class="filter-checks">
          <legend>Categorias</legend>
          <?php if (!is_wp_error($terms) && !empty($terms)) : ?>
            <?php foreach ($terms as $term) : ?>
              <label><input type="checkbox" name="product_cat[]" value="<?php echo esc_attr($term->slug); ?>" /> <?php echo esc_html($term->name); ?></label>
            <?php endforeach; ?>
          <?php endif; ?>
        </fieldset>

        <div class="price-filter">
          <span>Alcance de Preco</span>
          <div>
            <input type="number" name="min_price" placeholder="0000" min="0" />
            <b></b>
            <input type="number" name="max_price" placeholder="0000" min="0" />
          </div>
        </div>

        <button class="filter-apply" type="submit">Aplicar</button>
        <a class="filter-clear" href="<?php echo esc_url($shop_url); ?>">Limpar tudo</a>
      </section>
    </form>
  </aside>

  <section class="results-content" aria-labelledby="resultsTitle">
    <div class="section-title results-title">
      <span></span>
      <h1 id="resultsTitle"><?php woocommerce_page_title(); ?></h1>
    </div>
    <div class="results-list">
      <?php if (woocommerce_product_loop()) : ?>
        <?php while (have_posts()) : the_post(); ?>
          <?php global $product; if ($product instanceof WC_Product) { hrb_render_result_card($product); } ?>
        <?php endwhile; ?>
        <?php woocommerce_pagination(); ?>
      <?php else : ?>
        <p class="empty-results">Nenhum produto encontrado com os filtros atuais.</p>
      <?php endif; ?>
    </div>
  </section>
</main>

<?php get_footer(); ?>
