<script setup lang="ts">
  import { SearchHistory } from '@/widgets/search-history';

  import { useRoute, useRouter } from 'vue-router';
  import { AdvertisementList } from '@/entities/advertisement';
  import type { PreSearchResponse } from '@/shared/api/generated/Api';
  import { useUnit } from 'effector-vue/composition';
  import { preSearchQuery, searchQuery } from '@/entities/offer';
  import { $searchTerm } from '@/widgets/header/model/header-modal';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import '../model/advertisement-page-model';
  import { $selectedAdvertisementId } from '@/entities/advertisement/model/advertisement-model';
  import { onMounted } from 'vue';

  const route = useRoute();
  const router = useRouter();

  const searchValue = useUnit($searchTerm);

  const { start: search, data: searchData } = useUnit(searchQuery);
  const { data: preSearchData } = useUnit(preSearchQuery);
  const selectedAdvertisement = useUnit($selectedAdvertisementId);

  onMounted(() => {
    if (selectedAdvertisement.value && !preSearchData.value?.data) {
      router.push('/');
    }
  }); // watch(route, fetchSearchResult);

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

  const handleCardClicked = async (data: PreSearchResponse) => {
    try {
      const { article, brand } = data;
      await router.push({
        path: '/advertisements',
        query: {
          search: route.query.search,
          'active-pre-search': brand,
          'active-card': route.query['active-card'],
        },
      });
      if (data) {
        search({
          search: article?.toString() ?? '',
          page: searchData.value?.data.page,
          page_size: 10,
          brand: brand?.toString() ?? '',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
</script>

<template>
  <div class="w-full">
    <div
      class="flex items-center justify-between border-b border-r border-[#D0D4DB] p-4 pr-5">
      <h3
        v-if="route.path === '/advertisements'"
        class="text-[18px] font-semibold">
        {{ getAnnouncementText(preSearchData?.data.length ?? 0) }}
      </h3>
      <h3 v-else class="text-[18px] font-semibold">История поиска</h3>
    </div>
  </div>
  <ScrollArea class="max-h-[calc(100vh-177px)]">
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
        class="custom-scrollbar h-full overflow-auto bg-[#F9FAFB]" />
    </template>

    <SearchHistory
      class="custom-scrollbar h-full overflow-auto"
      v-if="route.path === '/search-history'" />
  </ScrollArea>
</template>
