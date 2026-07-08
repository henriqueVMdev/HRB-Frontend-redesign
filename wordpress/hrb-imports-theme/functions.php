<?php
/**
 * HRB Imports WooCommerce theme setup.
 */

if (!defined('ABSPATH')) {
    exit;
}

function hrb_theme_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('woocommerce', [
        'thumbnail_image_width' => 520,
        'single_image_width' => 900,
        'product_grid' => [
            'default_rows' => 4,
            'min_rows' => 1,
            'max_rows' => 6,
            'default_columns' => 4,
            'min_columns' => 1,
            'max_columns' => 4,
        ],
    ]);

    register_nav_menus([
        'primary' => __('Menu principal', 'hrb-imports'),
        'footer_links' => __('Links do rodape', 'hrb-imports'),
        'footer_support' => __('Suporte do rodape', 'hrb-imports'),
    ]);
}
add_action('after_setup_theme', 'hrb_theme_setup');

function hrb_enqueue_assets(): void
{
    wp_enqueue_style(
        'hrb-fonts',
        'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700;800&display=swap',
        [],
        null
    );

    wp_enqueue_style('hrb-style', get_stylesheet_uri(), ['hrb-fonts'], wp_get_theme()->get('Version'));
    wp_enqueue_script('hrb-woo', get_template_directory_uri() . '/assets/js/hrb-woo.js', ['jquery', 'wc-add-to-cart'], wp_get_theme()->get('Version'), true);
}
add_action('wp_enqueue_scripts', 'hrb_enqueue_assets');

function hrb_apply_product_filters(WP_Query $query): void
{
    if (is_admin() || !$query->is_main_query() || !hrb_wc_active()) {
        return;
    }

    $is_product_context = is_post_type_archive('product')
        || (function_exists('is_product_taxonomy') && is_product_taxonomy())
        || $query->get('post_type') === 'product';

    if (!$is_product_context) {
        return;
    }

    $tax_query = (array) $query->get('tax_query');

    $filters = [
        'filter_marca' => 'pa_marca',
        'filter_modelo' => 'pa_modelo',
        'filter_ano' => 'pa_ano',
    ];

    foreach ($filters as $param => $taxonomy) {
        if (empty($_GET[$param]) || !taxonomy_exists($taxonomy)) {
            continue;
        }

        $tax_query[] = [
            'taxonomy' => $taxonomy,
            'field' => 'slug',
            'terms' => sanitize_title(wp_unslash($_GET[$param])),
        ];
    }

    if (!empty($_GET['product_cat'])) {
        $categories = array_map('sanitize_title', (array) wp_unslash($_GET['product_cat']));
        $tax_query[] = [
            'taxonomy' => 'product_cat',
            'field' => 'slug',
            'terms' => $categories,
        ];
    }

    if (!empty($tax_query)) {
        $query->set('tax_query', $tax_query);
    }
}
add_action('pre_get_posts', 'hrb_apply_product_filters');

function hrb_asset(string $path): string
{
    return esc_url(get_template_directory_uri() . '/' . ltrim($path, '/'));
}

function hrb_wc_active(): bool
{
    return class_exists('WooCommerce');
}

function hrb_cart_total_html(): string
{
    if (!hrb_wc_active() || !WC()->cart) {
        return 'R$ 0,00';
    }

    return WC()->cart->get_cart_total();
}

function hrb_product_oem(WC_Product $product): string
{
    $oem = $product->get_meta('_hrb_oem') ?: $product->get_meta('oem');
    return $oem ?: $product->get_sku();
}

function hrb_product_tag(WC_Product $product): string
{
    $tag = $product->get_meta('_hrb_card_tag') ?: $product->get_meta('tag_card');
    if ($tag) {
        return $tag;
    }

    $terms = get_the_terms($product->get_id(), 'product_cat');
    return (!is_wp_error($terms) && !empty($terms)) ? $terms[0]->name : __('Produto', 'hrb-imports');
}

function hrb_product_image_url(WC_Product $product, string $fallback = 'assets/product-trocador.png'): string
{
    $image_id = $product->get_image_id();
    $image = $image_id ? wp_get_attachment_image_url($image_id, 'large') : '';
    return esc_url($image ?: get_template_directory_uri() . '/' . $fallback);
}

function hrb_price_parts(float $price): array
{
    $formatted = number_format($price, 2, ',', '.');
    [$integer, $cents] = explode(',', $formatted);

    return [$integer, $cents];
}

function hrb_pix_price(WC_Product $product): float
{
    $meta = $product->get_meta('_hrb_pix_price');
    $price = (float) wc_get_price_to_display($product);

    return $meta !== '' ? (float) $meta : round($price * 0.907, 2);
}

function hrb_get_products(array $args = []): array
{
    if (!hrb_wc_active()) {
        return [];
    }

    return wc_get_products(array_merge([
        'status' => 'publish',
        'limit' => 8,
    ], $args));
}

function hrb_add_to_cart_classes(WC_Product $product): string
{
    $classes = ['add_to_cart_button'];
    if ($product->supports('ajax_add_to_cart')) {
        $classes[] = 'ajax_add_to_cart';
    }
    $classes[] = 'product_type_' . $product->get_type();

    return esc_attr(implode(' ', $classes));
}

function hrb_render_product_card(WC_Product $product): void
{
    $regular = (float) $product->get_regular_price();
    $sale = (float) wc_get_price_to_display($product);
    $discount = ($regular > $sale && $regular > 0) ? max(1, round((1 - $sale / $regular) * 100)) : 10;
    ?>
    <article class="product-card">
      <a class="product-image" href="<?php echo esc_url($product->get_permalink()); ?>">
        <img src="<?php echo hrb_product_image_url($product); ?>" alt="<?php echo esc_attr($product->get_name()); ?>" loading="lazy" />
        <span class="tag"><?php echo esc_html(hrb_product_tag($product)); ?></span>
        <span class="discount"><?php echo esc_html($discount); ?>% OFF</span>
      </a>
      <div class="product-info">
        <div>
          <h3 class="product-name"><a href="<?php echo esc_url($product->get_permalink()); ?>"><?php echo esc_html($product->get_name()); ?></a></h3>
          <p class="oem">OEM: <?php echo esc_html(hrb_product_oem($product)); ?></p>
        </div>
        <div class="price-row">
          <div>
            <?php if ($regular > $sale) : ?>
              <span class="old-price"><?php echo wp_kses_post(wc_price($regular)); ?></span>
            <?php endif; ?>
            <strong class="price"><?php echo wp_kses_post($product->get_price_html()); ?></strong>
          </div>
          <a
            class="add-cart <?php echo hrb_add_to_cart_classes($product); ?>"
            href="<?php echo esc_url($product->add_to_cart_url()); ?>"
            data-product_id="<?php echo esc_attr($product->get_id()); ?>"
            data-quantity="1"
            rel="nofollow"
            aria-label="<?php echo esc_attr(sprintf(__('Adicionar %s ao carrinho', 'hrb-imports'), $product->get_name())); ?>"
          >+</a>
        </div>
      </div>
    </article>
    <?php
}

function hrb_render_result_card(WC_Product $product): void
{
    $price = (float) wc_get_price_to_display($product);
    [$integer, $cents] = hrb_price_parts($price);
    ?>
    <article class="result-card">
      <a class="result-image" href="<?php echo esc_url($product->get_permalink()); ?>">
        <img src="<?php echo hrb_product_image_url($product, 'assets/result-product.png'); ?>" alt="<?php echo esc_attr($product->get_name()); ?>" loading="lazy" />
        <span><?php echo esc_html(hrb_product_tag($product)); ?></span>
      </a>
      <div class="result-info">
        <div>
          <h2><a href="<?php echo esc_url($product->get_permalink()); ?>"><?php echo esc_html($product->get_name()); ?></a></h2>
          <div class="result-meta">
            <span>OEM: <?php echo esc_html(hrb_product_oem($product)); ?></span>
            <b></b>
            <span>SKU: <?php echo esc_html($product->get_sku() ?: $product->get_id()); ?></span>
          </div>
        </div>
        <p class="stock-dot"><?php echo $product->is_in_stock() ? esc_html__('Em estoque - Envio imediato', 'hrb-imports') : esc_html__('Consulte disponibilidade', 'hrb-imports'); ?></p>
      </div>
      <div class="result-buy">
        <div class="result-price" aria-label="<?php echo esc_attr(wp_strip_all_tags(wc_price($price))); ?>">
          <span>R$</span>
          <strong><?php echo esc_html($integer); ?></strong>
          <em>,<?php echo esc_html($cents); ?></em>
        </div>
        <p><?php echo esc_html(sprintf(__('ou 10x de %s', 'hrb-imports'), wp_strip_all_tags(wc_price($price / 10)))); ?></p>
        <div class="pix-row"><span>Pix</span><strong><?php echo wp_kses_post(wc_price(hrb_pix_price($product))); ?> a vista</strong></div>
        <a
          class="<?php echo hrb_add_to_cart_classes($product); ?>"
          href="<?php echo esc_url($product->add_to_cart_url()); ?>"
          data-product_id="<?php echo esc_attr($product->get_id()); ?>"
          data-quantity="1"
          rel="nofollow"
          data-add
        >
          <img src="<?php echo hrb_asset('assets/result-add-icon.svg'); ?>" alt="" />
          Adicionar
        </a>
        <a class="favorite-button" href="<?php echo esc_url($product->get_permalink()); ?>">
          <img src="<?php echo hrb_asset('assets/result-favorite.svg'); ?>" alt="" />
          Favoritar
        </a>
      </div>
    </article>
    <?php
}

function hrb_product_band(string $title, array $products): void
{
    if (empty($products)) {
        return;
    }
    $rail_id = sanitize_title($title);
    ?>
    <section class="product-band" id="<?php echo esc_attr($rail_id); ?>">
      <div class="band-header">
        <div class="section-title dark">
          <span></span>
          <h2><?php echo esc_html($title); ?></h2>
        </div>
        <div class="slider-actions">
          <button type="button" data-scroll="<?php echo esc_attr($rail_id); ?>-rail" data-direction="-1" aria-label="Voltar">&#8249;</button>
          <button type="button" data-scroll="<?php echo esc_attr($rail_id); ?>-rail" data-direction="1" aria-label="Avancar">&#8250;</button>
        </div>
      </div>
      <div class="product-rail" id="<?php echo esc_attr($rail_id); ?>-rail">
        <?php foreach ($products as $product) : ?>
          <?php hrb_render_product_card($product); ?>
        <?php endforeach; ?>
      </div>
    </section>
    <?php
}
