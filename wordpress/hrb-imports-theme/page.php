<?php
if (!defined('ABSPATH')) {
    exit;
}

get_header();

if (hrb_wc_active() && (is_cart() || is_checkout())) :
    ?>
    <main class="checkout-main">
      <section class="checkout-card" aria-labelledby="pageTitle">
        <div class="section-title checkout-title">
          <span></span>
          <h1 id="pageTitle"><?php the_title(); ?></h1>
        </div>
        <?php
        while (have_posts()) :
            the_post();
            the_content();
        endwhile;
        ?>
      </section>
    </main>
    <?php
elseif (hrb_wc_active() && is_account_page()) :
    while (have_posts()) :
        the_post();
        the_content();
    endwhile;
else :
    ?>
    <main class="product-detail-main">
      <?php
      while (have_posts()) :
          the_post();
          ?>
          <article class="description-card">
            <div class="section-title compact-title">
              <span></span>
              <h1><?php the_title(); ?></h1>
            </div>
            <?php the_content(); ?>
          </article>
      <?php endwhile; ?>
    </main>
    <?php
endif;

get_footer();
