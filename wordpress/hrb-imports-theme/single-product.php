<?php
if (!defined('ABSPATH')) {
    exit;
}

get_header();
the_post();
global $product;

if (!$product instanceof WC_Product) {
    get_footer();
    return;
}

$gallery_ids = $product->get_gallery_image_ids();
$main_image = hrb_product_image_url($product, 'assets/product-main.png');
$price = (float) wc_get_price_to_display($product);
$rating = (float) $product->get_average_rating();
$rating_count = (int) $product->get_rating_count();
$review_count = (int) $product->get_review_count();
$attributes = $product->get_attributes();
$applications = preg_split('/\r\n|\r|\n/', (string) $product->get_meta('_hrb_aplicacoes'));
?>

<main class="product-detail-main">
  <section class="product-hero-detail">
    <div class="product-gallery" aria-label="Galeria do produto">
      <img id="mainProductImage" class="main-product-image" src="<?php echo esc_url($main_image); ?>" alt="<?php echo esc_attr($product->get_name()); ?>" />
      <div class="product-thumbs" id="productThumbs">
        <button type="button" class="is-active" data-image="<?php echo esc_url($main_image); ?>" aria-label="Imagem principal">
          <img src="<?php echo esc_url($main_image); ?>" alt="" />
        </button>
        <?php foreach (array_slice($gallery_ids, 0, 4) as $image_id) : $thumb = wp_get_attachment_image_url($image_id, 'large'); ?>
          <button type="button" data-image="<?php echo esc_url($thumb); ?>" aria-label="Imagem secundaria">
            <img src="<?php echo esc_url($thumb); ?>" alt="" />
          </button>
        <?php endforeach; ?>
      </div>
    </div>

    <article class="product-purchase">
      <p class="product-category"><?php echo wp_kses_post(wc_get_product_category_list($product->get_id(), ' // ')); ?></p>
      <h1><?php echo esc_html($product->get_name()); ?></h1>
      <div class="product-identifiers">
        <span>OEM: <?php echo esc_html(hrb_product_oem($product)); ?></span>
        <b></b>
        <span>SKU: <?php echo esc_html($product->get_sku() ?: $product->get_id()); ?></span>
      </div>

      <section class="purchase-panel">
        <p class="in-stock"><?php echo $product->is_in_stock() ? 'Em estoque' : 'Consulte disponibilidade'; ?></p>
        <div>
          <span>Preco especial</span>
          <strong><?php echo wp_kses_post(wc_price($price)); ?></strong>
          <small><?php echo esc_html(sprintf('Ou 12x de %s sem juros no cartao', wp_strip_all_tags(wc_price($price / 12)))); ?></small>
        </div>
        <a
          class="detail-add <?php echo hrb_add_to_cart_classes($product); ?>"
          href="<?php echo esc_url($product->add_to_cart_url()); ?>"
          data-product_id="<?php echo esc_attr($product->get_id()); ?>"
          data-quantity="1"
          rel="nofollow"
        >
          <img src="<?php echo hrb_asset('assets/product-add-icon.svg'); ?>" alt="" />
          Adicionar
        </a>
        <a class="detail-favorite" href="<?php echo esc_url(hrb_wc_active() ? wc_get_cart_url() : '#'); ?>">
          <img src="<?php echo hrb_asset('assets/product-favorite.svg'); ?>" alt="" />
          Ver carrinho
        </a>
        <aside class="engineer-note">
          <strong>Performance engineered</strong>
          <p>Desenvolvido com suporte e precisao construtiva dedicada a alta performance e uso intensivo.</p>
        </aside>
      </section>
    </article>
  </section>

  <section class="product-info-grid">
    <article class="specs-card">
      <div class="section-title compact-title"><span></span><h2>Especificacoes Tecnicas</h2></div>
      <div class="specs-grid">
        <?php if (!empty($attributes)) : ?>
          <?php foreach (array_slice($attributes, 0, 6) as $attribute) : ?>
            <dl>
              <dt><?php echo esc_html(wc_attribute_label($attribute->get_name())); ?></dt>
              <dd><?php echo esc_html($product->get_attribute($attribute->get_name())); ?></dd>
            </dl>
          <?php endforeach; ?>
        <?php else : ?>
          <dl><dt>Material principal</dt><dd>Aluminio 6061-T6</dd></dl>
          <dl><dt>Garantia</dt><dd>ISO 9001:2015</dd></dl>
        <?php endif; ?>
      </div>
    </article>

    <article class="applications-card">
      <div class="section-title compact-title"><span></span><h2>Aplicacoes</h2></div>
      <ul>
        <?php foreach (array_filter($applications) ?: ['Mercedes C 250 W204 2008 - 2014', 'Mercedes SLK 250 R172 2012 - 2018', 'Mercedes E 250 W212 2011 - 2017'] as $application) : ?>
          <li><?php echo esc_html($application); ?></li>
        <?php endforeach; ?>
      </ul>
    </article>

    <article class="description-card">
      <div class="section-title compact-title"><span></span><h2>Descricao Tecnica</h2></div>
      <?php echo wp_kses_post(wpautop($product->get_description() ?: $product->get_short_description())); ?>
    </article>
  </section>

  <section class="reviews-area">
    <div class="section-title compact-title"><span></span><h2>Resumo das Avaliacoes</h2></div>
    <article class="rating-summary">
      <div class="rating-number">
        <strong><?php echo esc_html(number_format($rating ?: 4.8, 1, ',', '.')); ?></strong>
        <img src="<?php echo hrb_asset('assets/product-stars.svg'); ?>" alt="5 estrelas" />
        <p><?php echo esc_html(sprintf('%d Avaliacoes | %d Comentarios', $rating_count, $review_count)); ?></p>
        <p>97% dos avaliadores recomendam este produto.</p>
      </div>
      <div class="rating-bars" aria-label="Distribuicao das avaliacoes">
        <span>5 estrelas <b style="--bar: 86%"></b> 86%</span>
        <span>4 estrelas <b style="--bar: 8%"></b> 8%</span>
        <span>3 estrelas <b style="--bar: 1%"></b> 1%</span>
        <span>2 estrelas <b style="--bar: 0%"></b> 0%</span>
        <span>1 estrela <b style="--bar: 2%"></b> 2%</span>
      </div>
    </article>

    <div class="section-title compact-title"><span></span><h2>Avaliacoes</h2></div>
    <?php comments_template(); ?>
  </section>
</main>

<?php get_footer(); ?>
