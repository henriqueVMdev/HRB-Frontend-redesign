<?php
if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>
<main class="checkout-main">
  <section class="checkout-card" aria-labelledby="checkoutTitle">
    <div class="section-title checkout-title"><span></span><h1 id="checkoutTitle">Finalizar Compra</h1></div>
    <?php echo do_shortcode('[woocommerce_checkout]'); ?>
  </section>
</main>
<?php get_footer(); ?>
