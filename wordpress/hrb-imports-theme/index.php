<?php
if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>
<main class="product-detail-main">
  <?php if (have_posts()) : ?>
    <?php while (have_posts()) : the_post(); ?>
      <article class="description-card">
        <div class="section-title compact-title">
          <span></span>
          <h1><?php the_title(); ?></h1>
        </div>
        <?php the_content(); ?>
      </article>
    <?php endwhile; ?>
  <?php else : ?>
    <article class="description-card">
      <div class="section-title compact-title">
        <span></span>
        <h1>Nada encontrado</h1>
      </div>
      <p>Nenhum conteudo foi encontrado.</p>
    </article>
  <?php endif; ?>
</main>
<?php get_footer(); ?>
