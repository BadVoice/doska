<script setup lang="ts">
  import { Button } from '@/shared/ui';
  import { onBeforeUnmount, onMounted } from 'vue';
  import { useUnit } from 'effector-vue/composition';
  import {
    $filterOpened,
    filterVisibilityChanged,
    myRequestsQuery,
  } from '../model/my-requests-model';
  import RequestItem from './request-item.vue';
  import type { Bid } from '@/shared/api/generated/Api';
  import FilterForm from './filter-form.vue';

  const {
    $filterOpened: filterOpened,
    filterVisibilityChanged: changeFilterVisibility,
  } = useUnit({ $filterOpened, filterVisibilityChanged });
  const { start: fetchRequests, data: requests } = useUnit(myRequestsQuery);

  onMounted(() => {
    fetchRequests();
  });

  const status = [
    { color: '#FF9900', text: 'Создана' },
    { color: '#36E000', text: 'Опубликована' },
    { color: '#0017FC', text: 'Исполнена' },
    { color: '#FE2400', text: 'Архивирована' },
  ];

  onBeforeUnmount(() => {
    filterVisibilityChanged(false);
  });
</script>

<template>
  <div
    v-if="filterOpened"
    class="absolute inset-y-0 left-0 flex h-[100vh] w-full flex-col border-r border-[#D0D4DB] bg-white sm:max-w-[356px]">
    <FilterForm />
  </div>
  <template v-else>
    <div class="w-full">
      <div
        class="flex items-center justify-between border-b border-r border-[#D0D4DB] p-2 pr-5">
        <h3 class="text-[18px] font-semibold">Мои заявки</h3>
        <Button @click="changeFilterVisibility()" size="icon" variant="ghost">
          <img src="./assets/filterIcon.svg" alt="filterIcon" />
        </Button>
      </div>
    </div>
    <div
      class="h-[calc(100vh-177px)] w-full border-r border-[#D0D4DB] bg-[#F9FAFB]">
      <div
        class="mx-auto flex flex-col items-center justify-center gap-y-6 p-4"
        v-if="!requests?.length">
        <img
          src="./assets/interfaceRequestIcon.svg"
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
        <template v-for="item of requests">
          <RequestItem :item="item as Bid" :status="status" />
        </template>
      </div>
    </div>
  </template>
</template>
