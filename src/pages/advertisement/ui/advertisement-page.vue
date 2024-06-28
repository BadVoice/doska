<script setup lang="ts">
  import { SearchHistory } from '@/widgets/search-history';

  import {
    $selectedAdvertisementId,
    AdvertisementList,
  } from '@/entities/advertisement';
  import { preSearchQuery } from '@/entities/offer';
  import { $requestViewMode } from '@/pages/my-requests';
  import { cn } from '@/shared/lib';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { $searchTerm, $showSearch } from '@/widgets/header';
  import { useUnit } from 'effector-vue/composition';
  import { onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import '../model/advertisement-page-model';

  const route = useRoute();
  const router = useRouter();

  const searchValue = useUnit($searchTerm);
  const searchOpened = useUnit($showSearch);

  const { data: preSearchData, pending } = useUnit(preSearchQuery);
  const selectedAdvertisement = useUnit($selectedAdvertisementId);
  const requestViewMode = useUnit($requestViewMode);

  onMounted(() => {
    if (selectedAdvertisement.value && !preSearchData.value?.data) {
      router.push('/');
    } else if (!searchOpened.value) {
      router.push('/');
    }
  });

  function getAnnouncementText(count: number) {
    if (count === 0 || !count) {
      return 'Нет объявлений';
    } else if (count === 1) {
      return 'Найдено 1 объявление';
    } else if (count % 10 === 1 && count !== 11) {
      return `Найдено ${count} объявление`;
    } else if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count < 10 || count >= 20)
    ) {
      return `Найдено ${count} объявления`;
    } else {
      return `Найдено ${count} объявлений`;
    }
  }

  const emit = defineEmits([
    'advertisementClicked',
    'advertisementItems',
    'advertisementFilters',
  ]);
</script>

<template>
  <div class="w-full" v-if="!pending">
    <div
      class="flex items-center justify-between border-b border-r border-[#D0D4DB] p-4 pr-5">
      <h3
        v-if="
          route.path === '/advertisements' || requestViewMode === 'selectBrand'
        "
        class="text-[18px] font-semibold">
        {{ getAnnouncementText(preSearchData?.data?.length ?? 0) }}
      </h3>
      <h3 v-else class="text-[18px] font-semibold">История поиска</h3>
    </div>
  </div>
  <ScrollArea
    v-if="!pending"
    :class="
      cn(
        'h-[calc(100vh-177px)] w-full overflow-auto ',
        requestViewMode === 'selectBrand' && 'h-[calc(100vh-60px)]',
      )
    ">
    <template
      v-if="
        (route.path === '/advertisements' &&
          route.query.article &&
          route.query.brand) ||
        searchValue ||
        requestViewMode === 'selectBrand'
      ">
      <AdvertisementList
        v-if="preSearchData"
        :search-result="preSearchData?.data" />
    </template>

    <SearchHistory v-if="route.path === '/search-history'" />
  </ScrollArea>
  <div
    v-if="!preSearchData"
    class="h-[100vh] w-full border-r bg-[#F9FAFB]"></div>
</template>
