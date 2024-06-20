<script setup lang="ts">
  import { SearchHistory } from '@/widgets/search-history';

  import {
    $selectedAdvertisementId,
    AdvertisementList,
  } from '@/entities/advertisement';
  import { preSearchQuery } from '@/entities/offer';
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

  const { data: preSearchData } = useUnit(preSearchQuery);
  const selectedAdvertisement = useUnit($selectedAdvertisementId);

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
  <div class="w-full">
    <div
      class="flex items-center justify-between border-b border-r border-[#D0D4DB] p-4 pr-5">
      <h3
        v-if="route.path === '/advertisements'"
        class="text-[18px] font-semibold">
        {{ getAnnouncementText(preSearchData?.data?.length ?? 0) }}
      </h3>
      <h3 v-else class="text-[18px] font-semibold">История поиска</h3>
    </div>
  </div>
  <ScrollArea class="max-h-[calc(100vh-177px)] w-full">
    <template
      v-if="
        (route.path === '/advertisements' &&
          route.query.article &&
          route.query.brand) ||
        searchValue
      ">
      <AdvertisementList
        v-if="preSearchData"
        :search-result="preSearchData?.data"
        class="custom-scrollbar h-full w-full overflow-auto bg-[#F9FAFB]" />
    </template>

    <SearchHistory
      class="custom-scrollbar h-full overflow-auto"
      v-if="route.path === '/search-history'" />
  </ScrollArea>
  <div
    v-if="!preSearchData"
    class="h-[100vh] w-full border-r bg-[#F9FAFB]"></div>
</template>
