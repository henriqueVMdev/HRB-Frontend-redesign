<?php
if (!defined('ABSPATH')) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php wp_head(); ?>
  </head>
  <body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <header class="topbar">
      <a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php esc_attr_e('HRB Imports', 'hrb-imports'); ?>">
        <img src="<?php echo hrb_asset('assets/top-logo.svg'); ?>" alt="<?php esc_attr_e('HRB Imports', 'hrb-imports'); ?>" />
      </a>

      <?php
      wp_nav_menu([
          'theme_location' => 'primary',
          'container' => 'nav',
          'container_class' => 'desktop-nav',
          'fallback_cb' => false,
          'depth' => 1,
      ]);
      ?>

      <div class="header-actions">
        <a class="text-action" href="<?php echo esc_url(hrb_wc_active() ? wc_get_cart_url() : '#'); ?>">
          <span>Meu Carrinho</span>
          <strong class="hrb-cart-total"><?php echo wp_kses_post(hrb_cart_total_html()); ?></strong>
        </a>
        <a class="text-action" href="<?php echo esc_url(hrb_wc_active() ? wc_get_page_permalink('myaccount') : wp_login_url()); ?>">Minha Conta</a>
        <button class="menu-button" type="button" id="menuToggle" aria-label="Abrir menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
