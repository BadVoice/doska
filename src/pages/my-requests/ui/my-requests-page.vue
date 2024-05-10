<script setup lang="ts">
  import { Button } from '@/shared/ui';
  import { defineEmits, onMounted } from 'vue';
  import { useUnit } from 'effector-vue/composition';
  import { myRequestsQuery } from '../model/my-requests-model';

  const emit = defineEmits(['open-filter']);
  const handleFilterClick = () => {
    emit('open-filter');
  };

  const { data: requests, start: fetchRequests } = useUnit(myRequestsQuery);

  onMounted(() => {
    fetchRequests();
  });

  function renderFile(file: File) {
    return URL.createObjectURL(file);
  }

  const status = {
    0: { color: '#FF9900', text: 'Создана' },
    1: { color: '#36E000', text: 'Опубликована' },
    2: { color: '#0017FC', text: 'Исполнена' },
    3: { color: '#FE2400', text: 'Архивирована' },
  };
</script>

<template>
  <div class="w-full">
    <div
      class="flex items-center justify-between border-b border-r border-[#D0D4DB] p-2 pr-5">
      <h3 class="text-[18px] font-semibold">Мои заявки</h3>
      <Button @click="handleFilterClick" size="icon" variant="ghost">
        <img src="../assets/filterIcon.svg" alt="filterIcon" />
      </Button>
    </div>
  </div>
  <div
    class="h-[calc(100vh-177px)] w-full border-r border-[#D0D4DB] bg-[#F9FAFB]">
    <div
      class="mx-auto flex flex-col items-center justify-center gap-y-6 p-4"
      v-if="!requests?.length">
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
    <div v-else class="m-4 flex flex-col gap-y-4">
      <div
        v-for="item of requests"
        class="group flex w-full flex-col gap-y-2 rounded-md border-2 border-[#D0D4DB] px-4 py-3 transition-all duration-200 hover:border-[#0017FC]">
        <div class="flex flex-col">
          <div class="flex w-full justify-between">
            <p class="text-sm font-normal text-[#101828]">{{ item.name }}</p>
            <span
              class="cursor-pointer select-none text-3xl leading-[0px] text-[#858FA3]"
              >...</span
            >
          </div>
          <div class="flex w-full items-center justify-between">
            <p class="text-xs font-normal text-[#858FA3]">{{ item.brand }}</p>
            <p class="text-xs font-normal text-[#101828]">
              {{ item.amount }} шт
            </p>
          </div>
          <p class="text-xs font-normal text-[#858FA3]">{{ item.company }}</p>
        </div>

        <div class="flex gap-x-2" v-if="item.image">
          <img
            :src="renderFile(item.image)"
            alt="attachment"
            class="h-10 w-10 object-cover" />
        </div>
        <div class="flex items-center gap-x-1">
          <span
            :style="{ backgroundColor: status[item.status ?? 0].color }"
            class="mt-0.5 h-2 w-[9px] rounded-full" />
          <p class="text-sm" :style="{ color: status[item.status ?? 0].color }">
            {{ status[item.status ?? 0].text }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
