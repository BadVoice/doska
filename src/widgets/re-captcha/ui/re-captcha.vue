<script setup lang="ts">
import { useRecaptchaProvider } from 'vue-recaptcha'

useRecaptchaProvider()
import { useChallengeV2 } from 'vue-recaptcha'

const { root, onVerify } = useChallengeV2({
  options: {
    theme: 'light',
    size: 'normal',
  }
})

onVerify((response) => {
  console.log(response)
})
</script>

<template>
  <div ref="root" />
</template>