<script setup lang="ts">
  import { Button } from '@/shared/ui';
  import {
    $formMode,
    $isCreateCompanySingle,
    handleRegistrationFulfilled,
  } from '@/widgets/auth/lib/form-mode';
  import AuthCode from '@/widgets/auth/ui/auth-code.vue';
  import AuthDetails from '@/widgets/auth/ui/auth-details.vue';
  import CreateCompany from '@/widgets/auth/ui/create-company.vue';
  import VerificationCode from '@/widgets/auth/ui/verification-code.vue';
  import { useUnit } from 'effector-vue/composition';

  const emit = defineEmits(['submitCloseAuth']);
  const formMode = useUnit($formMode);
  const handleExit = useUnit(handleRegistrationFulfilled);
  const isCreateCompanySingle = useUnit($isCreateCompanySingle);

  function backForm() {
    handleExit();
  }

  handleRegistrationFulfilled.watch(() => {
    emit('submitCloseAuth', false);
  });
</script>

<template>
  <div
    class="h-[56px] w-full flex-col items-center justify-between border-b border-r border-[#D0D4DB] md:max-w-[356px]">
    <div class="flex w-full items-center justify-start gap-x-2 px-4 py-2">
      <Button class="-ml-2" @click="backForm()" size="icon" variant="ghost">
        <img
          src="../assets/backIcon.svg"
          class="h-6 w-6 select-none"
          alt="arrow" />
      </Button>
      <p class="cursor-default text-[18px] font-semibold">
        {{ isCreateCompanySingle ? 'Создание компании' : 'Вход' }}
      </p>
    </div>
  </div>
  <div
    class="min-h-[calc(100vh-56px)] w-full flex-grow border-r border-[#D0D4DB] bg-[#F9FAFB]">
    <AuthCode
      @on-login="emit('submitCloseAuth')"
      v-if="formMode === 'phoneOrEmail'" />
    <VerificationCode v-else-if="formMode === 'verification'" />
    <CreateCompany v-else-if="formMode === 'company'" />
    <AuthDetails v-else-if="formMode === 'details'" />
  </div>
</template>
