<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
    <footer class="footer">
      <section>
        <img src="<?php echo hrb_asset('assets/logo.svg'); ?>" alt="<?php esc_attr_e('HRB Imports', 'hrb-imports'); ?>" />
        <p>A distribuidora de confianca para quem exige pecas premium e precisao na aplicacao.</p>
        <small>CNPJ: 32.162.376/0001-99<br />Hortolandia - SP</small>
      </section>
      <section>
        <h2>Links</h2>
        <?php
        wp_nav_menu([
            'theme_location' => 'footer_links',
            'container' => false,
            'fallback_cb' => false,
            'depth' => 1,
        ]);
        ?>
      </section>
      <section>
        <h2>Atendimento e suporte</h2>
        <?php
        wp_nav_menu([
            'theme_location' => 'footer_support',
            'container' => false,
            'fallback_cb' => false,
            'depth' => 1,
        ]);
        ?>
      </section>
      <section>
        <h2>Acesso VIP para oficinas</h2>
        <p>Cadastre seu e-mail ou WhatsApp e receba condicoes exclusivas e novidades de estoque.</p>
        <form class="newsletter" action="<?php echo esc_url(home_url('/')); ?>" method="get">
          <input type="text" name="hrb_vip" placeholder="Email ou WhatsApp" aria-label="Email ou WhatsApp" />
          <button type="submit" aria-label="Cadastrar">&gt;</button>
        </form>
        <small>2026 HRB Imports Auto Parts. Todos os direitos reservados.</small>
      </section>
    </footer>
    <?php wp_footer(); ?>
  </body>
</html>
