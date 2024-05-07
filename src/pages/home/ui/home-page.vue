<script setup lang="ts">
  import { Button } from '@/shared/ui';
  import { Clipboard, ClipboardCheck } from 'lucide-vue-next';
  import { defineProps, ref } from 'vue';
  import type { SearchPagination } from '@/shared/api/generated/data-contracts';

  const copied = ref(false);

  defineProps<{
    pagination: SearchPagination;
  }>();

  function handleCopy() {
    copied.value = true;
    const type = 'text/plain';
    const blob = new Blob(['1547824'], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    window.navigator.clipboard.write(data);
  }
</script>

<template>
  <div class="w-full">
    <div
      class="flex items-center justify-between border-b border-r border-[#D0D4DB] p-4 pr-5">
      <h3 class="text-[18px] font-semibold">Главная страница</h3>
    </div>
  </div>
  <div
    class="h-[calc(100vh-177px)] w-full border-r border-[#D0D4DB] bg-[#F9FAFB]">
    <div class="mx-auto flex flex-col items-center justify-center gap-y-6 p-4">
      <div class="flex flex-col items-center gap-y-2">
        <div class="flex gap-x-1">
          <p class="text-[16px]">Для поиска артикл: 1547824</p>
          <Button
            size="icon"
            class="group h-6 w-6 bg-transparent hover:bg-transparent">
            <ClipboardCheck
              v-if="copied"
              @click="copied = false"
              class="h-5 w-5 stroke-blue-700 transition-all duration-100 group-hover:stroke-blue-950" />
            <Clipboard
              v-else
              @click="handleCopy"
              class="h-5 w-5 stroke-blue-700 transition-all duration-100 group-hover:stroke-blue-950" />
          </Button>
        </div>

        <p class="text-center text-[12px] text-[#858FA3]">
          Для навигации <br />
          используйте меню в верхней части экрана
        </p>
      </div>
    </div>
  </div>
</template>
