<script setup lang="ts">
  import { Button } from '@/shared/ui/button';

  import { ItemList, OfferList, searchQuery } from '@/entities/offer';
  import type { Item, Offer } from '@/shared/api/generated/Api';
  import { computed, onMounted, ref } from 'vue';

  import { offersQuery } from '@/entities/offer';
  import { $filterValues } from '@/features/filter';
  import {
    Pagination,
    PaginationEllipsis,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
  } from '@/shared/ui/pagination';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { offerAddButtonClicked } from '@/widgets/offers';
  import { useUnit } from 'effector-vue/composition';
  import { Plus } from 'lucide-vue-next';

  defineProps<{ class: string }>();

  const currentPage = defineModel<number>('currentPage', {
    required: true,
  });

  const isMobile = ref(false);

  const filterValues = useUnit($filterValues);
  const handleAddOffer = useUnit(offerAddButtonClicked);

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

  const emit = defineEmits([
    'offerClicked',
    'open-filter',
    'closeOffers',
    'page-selected',
  ]);

  const { data } = useUnit(searchQuery);
  const { data: offers } = useUnit(offersQuery);

  const handleItemClick = (item: Item) => {
    if (!item) {
      return;
    }
    emit('offerClicked', item);
  };

  const handleFilterClick = () => {
    emit('open-filter');
  };

  const checkIsMobile = () => {
    isMobile.value = window.innerWidth < 440;
  };

  onMounted(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
  });

  const itemsCount = computed(
    () =>
      (data.value?.data?.items_count ?? 0) + (offers?.value?.data?.length ?? 0),
  );
  const PAGE_LIMIT = 30;
</script>

<template>
  <div class="flex w-full flex-col sm:max-h-[100vh]" v-if="!!data?.data">
    <div class="w-full min-w-[350px]">
      <div
        class="flex max-h-16 items-center border-b border-r border-[#D0D4DB] bg-white p-4 pr-5">
        <Button
          class="-ml-2 sm:hidden"
          @click="$emit('closeOffers')"
          size="icon"
          variant="ghost">
          <img
            src="./assets/backIcon.svg"
            class="h-6 w-6 select-none"
            alt="arrow" />
        </Button>

        <div class="flex w-full items-center justify-between">
          <h3 class="text-[18px] font-semibold">
            {{ getAnnouncementText(itemsCount ?? 0) }}
          </h3>
          <div class="flex gap-x-2">
            <Button
              v-if="
                getAnnouncementText(itemsCount ?? 0) !== 'Нет предложений' ||
                filterValues
              "
              @click="handleFilterClick"
              size="icon"
              variant="ghost">
              <img src="./assets/filterIcon.svg" alt="filterIcon" />
            </Button>
            <Button @click="handleAddOffer()" size="icon" variant="ghost">
              <Plus class="h-7 w-7" color="#0017FC" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <ScrollArea
      v-if="data?.data"
      class="flex max-h-[calc(100vh-72px)] flex-col gap-y-4 px-4 max-sm:max-h-[calc(100vh-201px)]">
      <OfferList
        :offers-items="offers?.data as Offer[]"
        @offer-clicked="handleItemClick" />
      <ItemList
        :offers-items="(data?.data.items ?? []) as any"
        @offer-clicked="handleItemClick" />
      <div class="mx-auto flex w-fit bg-[#F9FAFB] py-2">
        <Pagination
          v-if="(itemsCount ?? 0) > PAGE_LIMIT"
          :total="itemsCount"
          v-slot="{ page }"
          :sibling-count="1"
          :show-edges="!isMobile"
          @update:page="(value) => $emit('page-selected', value)"
          v-model:page="currentPage"
          class="mx-auto gap-1 sm:-translate-x-1 sm:gap-2">
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
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
      </div>
    </ScrollArea>
    <div v-if="itemsCount === 0">
      <div
        class="mx-auto flex flex-col items-center justify-center gap-y-6 p-4">
        <img
          src="./assets/interfaceRequestIcon.svg"
          alt="interfaceRequestIcon"
          class="mt-8" />
        <div class="flex flex-col items-center gap-y-2">
          <p class="text-[16px]">Ваш список предложений пуст</p>
          <p class="text-center text-[12px] text-[#858FA3]">
            Что бы создать предложение <br />
            используйте «+» в верхней части экрана
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
