<script setup lang="ts">
  import { Button } from '@/shared/ui/button';

  import { onMounted, onUnmounted, ref } from 'vue';
  import type { Item } from '@/shared/api/generated/Api';
  import { OfferList, searchQuery } from '@/entities/offer';

  import {
    Pagination,
    PaginationEllipsis,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
  } from '@/shared/ui/pagination';
  import { useUnit } from 'effector-vue/composition';
  import { resetRequestViewMode } from '@/pages/my-requests/model/my-requests-model';

  defineProps<{ class: string }>();

  const isMobile = ref(false);
  const page = ref(1);

  const requestViewMode = useUnit(resetRequestViewMode);

  function getAnnouncementText(count: number) {
    if (count === 0 || !count) {
      return 'Нет предложений';
    } else if (count === 1) {
      return 'Найдено 1 предложение';
    } else if (count % 10 === 1 && count !== 11) {
      return `Найдено ${count} предложение`;
    } else if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count < 10 || count >= 20)
    ) {
      return `Найдено ${count} предложения`;
    } else {
      return `Найдено ${count} предложений`;
    }
  }

  const emit = defineEmits(['offerClicked', 'open-filter', 'page-selected']);

  const { data } = useUnit(searchQuery);

  const handleItemClick = (item: Item) => {
    if (!item) {
      return;
    }
    emit('offerClicked', item);
  };

  const handleFilterClick = () => {
    emit('open-filter');
  };

  onMounted(() => {
    document.body.style.overflow = 'hidden';
  });
  onUnmounted(() => {
    document.body.style.overflow = 'auto';
  });

  const checkIsMobile = () => {
    isMobile.value = window.innerWidth < 440;
  };

  onMounted(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
  });
</script>

<template>
  <div class="flex flex-col w-full" v-if="!!data?.data?.items">
    <div class="w-full min-w-[350px]">
      <div
        class="flex items-center border-b border-r border-[#D0D4DB] bg-white p-4 pr-5">
        <Button
          class="-ml-2 sm:hidden"
          @click="requestViewMode"
          size="icon"
          variant="ghost">
          <img
            src="./assets/backIcon.svg"
            class="h-6 w-6 select-none"
            alt="arrow" />
        </Button>

        <div class="flex w-full items-center justify-between">
          <h3 class="text-[18px] font-semibold">
            {{ getAnnouncementText(data?.data.items_count ?? 0) }}
          </h3>
          <Button
            v-if="
              getAnnouncementText(data?.data.items_count ?? 0) !==
              'Нет предложений'
            "
            @click="handleFilterClick"
            size="icon"
            variant="ghost">
            <img src="./assets/filterIcon.svg" alt="filterIcon" />
          </Button>
        </div>
      </div>
    </div>

    <div
      v-if="data?.data.items"
      class="custom-scrollbar flex h-[100vh] flex-col items-center gap-4 overflow-auto bg-[#F9FAFB] p-4 sm:max-h-[calc(100vh-150px)]">
      <OfferList
        :offers-items="data?.data.items as any"
        @offer-clicked="handleItemClick" />
    </div>

    <div class="flex bg-[#F9FAFB] py-4">
      <Pagination
        v-if="!!data?.data.pages"
        v-slot="{ page }"
        :total="data?.data.items_count"
        :sibling-count="1"
        :show-edges="!isMobile"
        @update:page="(value) => $emit('page-selected', value)"
        v-model:page="page"
        class="mx-auto gap-1 sm:-translate-x-1 sm:gap-2">
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationPrev v-if="data?.data.has_prev" />

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

          <PaginationNext v-if="data?.data.has_next" />
        </PaginationList>
      </Pagination>
    </div>
  </div>
  <!--    <div-->
  <!--      v-else-->
  <!--      class="custom-scrollbar h-[calc(100vh-73px)] overflow-auto bg-[#F9FAFB]"></div>-->
  <!--  </div>-->
</template>

<style scoped>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #d0d4db #f9fafb;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    background-color: #f9fafb;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d0d4db;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #a7acb5;
  }
</style>
