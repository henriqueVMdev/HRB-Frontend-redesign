<?php
defined('ABSPATH') || exit;

do_action('woocommerce_before_customer_login_form');
?>

<main class="signup-main">
  <section class="signup-card login-card" aria-labelledby="loginTitle">
    <a class="signup-logo login-logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Voltar para HRB Imports">
      <img src="<?php echo hrb_asset('assets/signup-logo.svg'); ?>" alt="HRB Imports Auto Parts" />
    </a>

    <header class="signup-heading login-heading">
      <h1 id="loginTitle">Login</h1>
      <p>Acesse sua conta para continuar comprando</p>
    </header>

    <form class="login-form woocommerce-form woocommerce-form-login login" method="post">
      <?php do_action('woocommerce_login_form_start'); ?>
      <label>
        <span>Login</span>
        <input type="text" name="username" autocomplete="username" placeholder="Example.@Email.com" required />
      </label>
      <label>
        <span>Senha</span>
        <input type="password" name="password" autocomplete="current-password" placeholder="Example123" required />
      </label>
      <?php wp_nonce_field('woocommerce-login', 'woocommerce-login-nonce'); ?>
      <button class="login-submit" type="submit" name="login" value="<?php esc_attr_e('Login', 'woocommerce'); ?>">Login</button>
      <?php do_action('woocommerce_login_form_end'); ?>
    </form>

      <?php if ('yes' === get_option('woocommerce_enable_myaccount_registration')) : ?>
      <form method="post" class="signup-form woocommerce-form woocommerce-form-register register">
        <?php do_action('woocommerce_register_form_start'); ?>
        <?php if ('no' === get_option('woocommerce_registration_generate_username')) : ?>
          <label class="wide">
            <span>Usuario</span>
            <input type="text" name="username" autocomplete="username" placeholder="Ex: oficina.hrb" required />
          </label>
        <?php endif; ?>
        <label class="wide">
          <span>E-mail</span>
          <input type="email" name="email" autocomplete="email" placeholder="Ex: example@exemplo.com" required />
        </label>
        <?php if ('no' === get_option('woocommerce_registration_generate_password')) : ?>
          <label class="wide">
            <span>Senha</span>
            <input type="password" name="password" autocomplete="new-password" placeholder="*********" required />
          </label>
        <?php endif; ?>
        <?php wp_nonce_field('woocommerce-register', 'woocommerce-register-nonce'); ?>
        <button class="signup-submit" type="submit" name="register" value="<?php esc_attr_e('Register', 'woocommerce'); ?>">Cadastrar</button>
        <?php do_action('woocommerce_register_form_end'); ?>
      </form>
    <?php endif; ?>
  </section>
</main>

<?php do_action('woocommerce_after_customer_login_form'); ?>
