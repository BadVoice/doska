<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  declare global {
    interface Window {
      grecaptcha: any;
    }
  }

  const siteKey = ref<string>('6LeKHdMpAAAAAAbIOl0SFGZzvsCc3dzik4IKkZyI');
  const recaptchaContainer = ref<HTMLDivElement | null>(null);

  const emit = defineEmits(['captcha-verified']);

  const onVerify = (response: string) => {
    emit('captcha-verified', response);
  };

  const onExpired = (): void => {
    console.error('reCAPTCHA expired');
  };

  onMounted((): void => {
    if (typeof window.grecaptcha === 'undefined') {
      console.warn('g-recaptcha not loaded!');
      return;
    }

    window.grecaptcha.render(recaptchaContainer.value!, {
      sitekey: siteKey.value,
      callback: onVerify,
      'expired-callback': onExpired,
    });
  });
</script>

<template>
  <div id="recaptcha-container" ref="recaptchaContainer"></div>
</template>
