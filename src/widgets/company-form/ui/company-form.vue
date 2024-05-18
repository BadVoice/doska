<script setup lang="ts">
  import { Button } from '@/shared/ui';
  import { CreateCompany } from '@/features/create-company';

  const emit = defineEmits(['submitCloseCompany']);
</script>

<template>
  <div
    class="h-[56px] w-full flex-col items-center justify-between border-b border-r border-[#D0D4DB] md:max-w-[356px]">
    <div class="flex w-full items-center justify-start gap-x-2 px-4 py-2">
      <Button
        class="-ml-2"
        @click="emit('submitCloseCompany')"
        size="icon"
        variant="ghost">
        <img
          src="../assets/backIcon.svg"
          class="h-6 w-6 select-none"
          alt="back icon" />
      </Button>
      <p class="cursor-default text-[18px] font-semibold">Создание компании</p>
    </div>
  </div>
  <div
    class="min-h-[calc(100vh-56px)] w-full flex-grow border-r border-[#D0D4DB] bg-[#F9FAFB]">
    <CreateCompany @close-register-company="emit('submitCloseCompany')" />
  </div>
</template>
