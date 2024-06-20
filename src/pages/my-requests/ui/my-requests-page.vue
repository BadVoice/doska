<script setup lang="ts">
  import { $selectedCompany } from '@/entities/company';
  import { myRequestsQuery } from '@/entities/requests';
  import type { Bid } from '@/shared/api/generated/Api';
  import { Button } from '@/shared/ui';
  import {
    Pagination,
    PaginationEllipsis,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
  } from '@/shared/ui/pagination';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { $searchTerm, $selectedSortType } from '@/widgets/header';
  import { useUnit } from 'effector-vue/composition';
  import { computed, onBeforeUnmount } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    $currentPage,
    $filterOpened,
    $searchQS,
    filterVisibilityChanged,
    pageSelected,
  } from '../model/my-requests-model';
  import FilterForm from './filter-form.vue';
  import RequestItem from './request-item.vue';

  const emit = defineEmits(['handleData']);
  const router = useRouter();
  const route = useRoute();

  const {
    $filterOpened: filterOpened,
    filterVisibilityChanged: changeFilterVisibility,
  } = useUnit({ $filterOpened, filterVisibilityChanged });

  const { data: requests, pending } = useUnit(myRequestsQuery);
  const selectedSortType = useUnit($selectedSortType);
  const selectedCompany = useUnit($selectedCompany);
  const searchValue = useUnit($searchTerm);

  const status = [
    { color: '#FF9900', text: 'Создана' },
    { color: '#36E000', text: 'Опубликована' },
    { color: '#0017FC', text: 'Исполнена' },
    { color: '#FE2400', text: 'Архивирована' },
  ];

  onBeforeUnmount(() => {
    filterVisibilityChanged(false);
  });

  $searchQS.watch((value) => {
    router.push({
      query: {
        search: value?.search,
        'active-pre-search': value?.brand,
        'active-card': route.query['active-card'],
      },
    });
  });

  const page = useUnit($currentPage);
  const changePage = useUnit(pageSelected);

  const filteredList = computed(() =>
    (selectedSortType.value >= 0
      ? requests.value?.results?.filter((request) =>
          selectedCompany.value !== null && selectedCompany.value
            ? request.status === selectedSortType.value &&
              request.company === selectedCompany.value.id
            : request.status === selectedSortType.value,
        )
      : requests.value?.results
    )?.filter((request) => request.name.includes(searchValue.value ?? '')),
  );
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
      class="h-[calc(100vh-186px)] w-full overflow-hidden border-r border-[#D0D4DB] bg-[#F9FAFB]">
      <div
        class="mx-auto flex flex-col items-center justify-center gap-y-6 p-4"
        v-if="!requests?.results?.length">
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
      <ScrollArea v-else-if="!pending" class="h-[calc(100vh-186px)]">
        <div class="my-4 flex flex-col gap-y-2 px-4">
          <RequestItem
            v-for="item in filteredList"
            :item="item as Bid"
            :status="status" />
        </div>

        <Pagination
          v-slot="{ page }"
          :total="filteredList?.length"
          :sibling-count="0"
          show-edges
          :items-per-page="150"
          :page="page"
          @update:page="changePage"
          class="mx-auto w-fit"
          :default-page="1">
          <PaginationList
            v-slot="{ items }"
            class="mx-auto mb-4 flex items-center gap-1">
            <PaginationPrev />

            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child>
                <Button
                  class="h-10 w-10 p-0"
                  :variant="item.value === page ? 'default' : 'outline'">
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <PaginationNext />
          </PaginationList>
        </Pagination>
      </ScrollArea>

      <div
        v-else
        class="flex h-full max-h-[calc(100vh-186px)] w-full scale-[2] items-center justify-center">
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
