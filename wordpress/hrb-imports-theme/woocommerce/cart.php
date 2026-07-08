<?php
if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>
<main class="checkout-main">
  <section class="checkout-card" aria-labelledby="cartTitle">
    <div class="section-title checkout-title"><span></span><h1 id="cartTitle">Meu Carrinho</h1></div>
    <?php echo do_shortcode('[woocommerce_cart]'); ?>
  </section>
</main>
<?php get_footer(); ?>
