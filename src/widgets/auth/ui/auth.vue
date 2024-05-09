<script setup lang="ts">
import { Button } from '@/shared/ui';
const emit = defineEmits(['submitCloseAuth']);
</script>

<template>
  <div
  class="w-full flex-col items-center justify-between border-b border-r border-[#D0D4DB] md:max-w-[356px] h-[56px]">
    <div class="flex w-full items-center justify-start px-4 py-2 gap-x-2">
      <Button
        class="-ml-2"
        @click="emit('submitCloseAuth')"
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
  <div>
    content
  </div>
  <div>
    footer
  </div>
</template>

<style scoped lang="postcss">

</style>