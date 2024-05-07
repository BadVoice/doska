<script setup lang="ts">
  import { Button } from '@/shared/ui';
  import { defineEmits } from 'vue';

  const emit = defineEmits(['open-filter']);
  const handleFilterClick = () => {
  emit('open-filter');
};

</script>

<template>
  <div class="w-full">
    <div
      class="flex items-center justify-between border-b border-r border-[#D0D4DB] p-2 pr-5">
      <h3 class="text-[18px] font-semibold ">Мои заявки</h3>
      <Button
        @click="handleFilterClick"
        size="icon"
        variant="ghost">
        <img src="../assets/filterIcon.svg" alt="filterIcon" />
      </Button>
    </div>
  </div>
  <div
    class="h-[calc(100vh-177px)] w-full border-r border-[#D0D4DB] bg-[#F9FAFB]">
    <div class="mx-auto flex flex-col items-center justify-center gap-y-6 p-4">
      <img
        src="../assets/interfaceRequestIcon.svg"
        alt="interfaceRequestIcon"
        class="mt-8" />
      <div class="flex flex-col items-center gap-y-2">
        <p class="text-[16px]">Ваш список заявок пуст</p>
        <p class="text-center text-[12px] text-[#858FA3]">
          Что бы разместить свою первую заявку <br />
          используйте «+» в верхней части экрана
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
