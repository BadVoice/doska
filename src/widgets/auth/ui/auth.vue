<script setup lang="ts">
  import { Button } from '@/shared/ui';
  import { AuthCode, AuthDetails, CompanyForm } from '@/widgets/auth';
  import { useUnit } from 'effector-vue/composition';
  import { $formIndex, $formMode, formIndexExceded } from '@/widgets/auth/lib/form-mode';
  import { formPrevClicked } from '../model/auth-model';

  const emit = defineEmits(['submitCloseAuth']);
  const formMode = useUnit($formMode);
  const prevForm = useUnit(formPrevClicked);
  const formIndex = useUnit($formIndex);

  function backForm() {
    if (formIndex.value >= 1) {
      prevForm();
    } else {
      emit('submitCloseAuth', false);
    }
  }

  formIndexExceded.watch(() => {
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
      <p class="cursor-default text-[18px] font-semibold">Вход</p>
    </div>
  </div>
  <div
    class="min-h-[calc(100vh-56px)] w-full flex-grow border-r border-[#D0D4DB] bg-[#F9FAFB]">
    <AuthCode
      @on-login="emit('submitCloseAuth')"
      v-if="formMode === 'phoneOrEmail'" />
    <AuthDetails v-else-if="formMode === 'details'" />
    <CompanyForm v-else />
  </div>
</template>
