<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { SearchHistory } from '@/widgets/search-history';

  import { type LocationQueryValue, useRoute, useRouter } from 'vue-router';
  import { AdvertisementList } from '@/entities/advertisement';
  import type {
    Item,
    PreSearchResponse,
    PreSearchResponses,
    SearchResponse,
  } from '@/shared/api/generated/Api';
  import { $qwepApi } from '@/shared/api/api';

  const route = useRoute();
  const router = useRouter();

  const pagination = defineModel<
    Pick<
      SearchResponse,
      'has_next' | 'has_prev' | 'page' | 'items' | 'items_count' | 'pages'
    >
  >('pagination', {
    required: true,
  });

  const searchResult = ref<PreSearchResponses>([]);
  const searchParam = ref<string | LocationQueryValue[]>('');
  const advertisementCount = ref<number>(0);

  onMounted(fetchSearchResult);
  watch(route, fetchSearchResult);

  async function fetchSearchResult() {
    searchParam.value = route.query.search as string;
    try {
      if (searchParam.value) {
        searchResult.value = (
          await $qwepApi.preSearch.getPreSearch({
            search: searchParam.value,
          })
        ).data;
        advertisementCount.value = searchResult.value.length;
      }
    } catch (error) {
      console.log(error);
    }
  }

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
      const { article, brand, id } = data;
      await router.push({
        path: '/advertisements',
        query: {
          search: route.query.search,
          'active-pre-search': brand,
          'active-card': route.query['active-card'],
        },
      });
      if (data) {
        await $qwepApi.search
          .getSearch({
            search: article as string,
            page: pagination.value.page,
            page_size: 10,
            brand: brand as string,
          })
          .then((response) => {
            const { data: items } = response;
            pagination.value = {
              items_count: items.items_count,
              has_next: !!items.has_next,
              has_prev: !!items.has_prev,
              page: items.page,
              pages: items.pages,
            };
            emit('advertisementItems', response.data.items);
            emit('advertisementFilters', response.data.filters);
            return response.data.items as Item[];
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
</script>

<template>
  <div class="w-full">
    <div
      class="flex items-center justify-between border-b border-r border-[#D0D4DB] p-4 pr-5">
      <h3
        v-if="route.path === '/advertisements' && searchParam"
        class="text-[18px] font-semibold">
        {{ getAnnouncementText(advertisementCount) }}
      </h3>
      <h3 v-else class="text-[18px] font-semibold">История поиска</h3>
    </div>
  </div>
  <div
    class="h-[calc(100vh-177px)] w-full border-r border-[#D0D4DB] bg-[#F9FAFB]">
    <template
      class="custom-scrollbar h-full overflow-auto"
      v-if="
        (route.path === '/advertisements' &&
          route.query.article &&
          route.query.brand) ||
        route.query.search
      ">
      <AdvertisementList
        class="custom-scrollbar h-full overflow-auto"
        :search-result="searchResult"
        @advertisementClicked="handleCardClicked" />
    </template>
    <SearchHistory
      class="custom-scrollbar h-full overflow-auto"
      v-if="route.path === '/search-history'" />
  </div>
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
