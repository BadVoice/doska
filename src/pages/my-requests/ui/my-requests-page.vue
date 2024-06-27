<script setup lang="ts">
  import { $selectedCompany } from '@/entities/company';
  import { getOrders } from '@/entities/order';
  import { myRequestsQuery } from '@/entities/requests';
  import type { Bid, Order } from '@/shared/api/generated/Api';
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
  import { onBeforeUnmount } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    $currentPage,
    $filterOpened,
    $filteredRequests,
    $searchQS,
    filterVisibilityChanged,
    pageSelected,
  } from '../model/my-requests-model';
  import FilterForm from './filter-form.vue';
  import OrderItem from './order-item.vue';
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
  const { data: orders, pending: pendingOrders } = useUnit(getOrders);

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

  const filteredList = useUnit($filteredRequests);
</script>

<template>
  <div
    v-if="filterOpened"
    class="absolute inset-y-0 left-0 flex max-h-[100vh] w-full flex-col overflow-hidden border-r border-[#D0D4DB] bg-white sm:max-w-[356px]">
    <FilterForm />
  </div>
  <template v-else>
    <div class="w-full">
      <div
        class="flex h-14 items-center justify-between border-b border-r border-[#D0D4DB] p-2 pr-5">
        <h3 class="text-[18px] font-semibold">
          {{ selectedSortType === -3 ? 'Мои заказы' : 'Мои заявки' }}
        </h3>
        <Button
          v-if="selectedSortType !== -3"
          @click="changeFilterVisibility()"
          size="icon"
          variant="ghost">
          <img src="./assets/filterIcon.svg" alt="filterIcon" />
        </Button>
      </div>
    </div>
    <div
      class="h-[calc(100vh-180px)] w-full overflow-hidden border-r border-[#D0D4DB] bg-[#F9FAFB]">
      <div
        class="mx-auto flex flex-col items-center justify-center gap-y-6 p-4"
        v-if="!filteredList?.length && !pending">
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
      <ScrollArea
        v-else-if="selectedSortType >= -1"
        class="h-[calc(100vh-186px)]"
        v-if="filteredList">
        <DynamicScroller
          :items="filteredList"
          :min-item-size="148"
          v-slot="{ item, index, active }"
          class="my-4 flex flex-col gap-y-2 px-4">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            :size-dependencies="[item.name]">
            <div class="pb-4">
              <RequestItem :item="item as Bid" :status="status" />
            </div>
          </DynamicScrollerItem>
        </DynamicScroller>
        <Pagination
          v-if="!pending && filteredList.length > 150"
          v-slot="{ page }"
          :total="
            searchValue === '' || !searchValue || searchValue === null
              ? requests?.count
              : filteredList?.length
          "
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
      <ScrollArea v-if="selectedSortType === -3" class="h-[calc(100vh-186px)]">
        <DynamicScroller
          :items="
            selectedCompany?.id
              ? orders?.data?.filter(
                  (o) => o.company === (selectedCompany?.id ?? 1),
                )
              : orders?.data
          "
          :min-item-size="148"
          v-slot="{ item, index, active }"
          class="my-4 flex flex-col gap-y-2 px-4">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            :size-dependencies="[item.name]">
            <div class="pb-4"><OrderItem :item="item as Order" /></div>
          </DynamicScrollerItem>
        </DynamicScroller>
        <Pagination
          v-if="!pendingOrders && (orders?.data?.length ?? 0) > 150"
          v-slot="{ page }"
          :total="
            searchValue === '' || !searchValue || searchValue === null
              ? requests?.count
              : filteredList?.length
          "
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
    </div>
  </template>
</template>
