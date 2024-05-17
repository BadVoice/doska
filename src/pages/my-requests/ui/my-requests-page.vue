<script setup lang="ts">
  import { Button } from '@/shared/ui';
  import { onBeforeUnmount, onMounted } from 'vue';
  import { useUnit } from 'effector-vue/composition';
  import {
    $filterOpened,
    filterVisibilityChanged,
    requestHistoryVisible,
    searchOffersMutation,
  } from '../model/my-requests-model';
  import RequestItem from './request-item.vue';
  import type { Bid } from '@/shared/api/generated/Api';
  import FilterForm from './filter-form.vue';
  import { myRequestsQuery } from '@/entities/requests';

  const emit = defineEmits(['handleData']);

  const {
    $filterOpened: filterOpened,
    filterVisibilityChanged: changeFilterVisibility,
  } = useUnit({ $filterOpened, filterVisibilityChanged });

  const handleRequestClicked = useUnit(requestHistoryVisible);

  const {
    start: handleMount,
    data: requests,
    pending,
  } = useUnit(myRequestsQuery);

  onMounted(handleMount);

  const status = [
    { color: '#FF9900', text: 'Создана' },
    { color: '#36E000', text: 'Опубликована' },
    { color: '#0017FC', text: 'Исполнена' },
    { color: '#FE2400', text: 'Архивирована' },
  ];

  onBeforeUnmount(() => {
    filterVisibilityChanged(false);
  });

  searchOffersMutation.finished.success.watch(({ result }) => {
    const { data } = result;

    emit('handleData', {
      list: data.items,
      filters: data.filters,
      pagination: {
        items_count: data.items_count,
        has_next: !!data.has_next,
        has_prev: !!data.has_prev,
        page: data.page,
        pages: data.pages,
      },
    });

    handleRequestClicked(true);
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
      <div v-else-if="!pending" class="m-4 flex flex-col gap-y-4">
        <RequestItem
          v-for="item of requests"
          :item="item as Bid"
          :status="status" />
      </div>
      <div
        v-else
        class="flex h-full w-full scale-[2] items-center justify-center">
        <svg
          class="h-5 w-5 animate-spin text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
  </template>
</template>
