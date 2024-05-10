<script setup lang="ts">
import { Button } from '@/shared/ui';
import { AuthCode, AuthDetails, CompanyForm } from '@/widgets/auth';
import { ref } from 'vue';
const emit = defineEmits(['submitCloseAuth']);

const submitCode = ref(false)
const authDetails = ref(false)
const registerForm = ref(false)
</script>

<template>
  <div
  class="w-full flex-col items-center justify-between border-b border-r border-[#D0D4DB] md:max-w-[356px] h-[56px]">

    <div class="flex w-full items-center justify-start px-4 py-2 gap-x-2">
      <Button
        class="-ml-2"
        @click="emit('submitCloseAuth', false)"
        size="icon"
        variant="ghost">
        <img
          src="../assets/backIcon.svg"
          class="h-6 w-6 select-none"
          alt="arrow" />
      </Button>
      <p class="font-semibold text-[18px] cursor-default">Вход</p>
    </div>
  </div>

  <div class="bg-[#F9FAFB] w-full h-full border-r border-[#D0D4DB] flex-grow overflow-x-auto">
    <AuthCode @submit-code="submitCode = true" v-if="!submitCode" />
    <AuthDetails @submit-details="authDetails = true" v-if="submitCode && !authDetails" />
    <CompanyForm @register-company="registerForm = true" v-if="authDetails && !registerForm" />
  </div>

</template>

<style scoped lang="postcss">

</style>