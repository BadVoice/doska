<script setup lang="ts">
  import { ProductCard } from '@/pages/home';
  import { Header } from '@/widgets/header';
  import { Filter } from '@/features/filter';
  import { useRoute, useRouter } from 'vue-router';
  import { onMounted, ref, watch } from 'vue';
  import { Offers } from '@/widgets/offers';
  import type { Item, SearchPagination, SearchResponseFilters } from '@/shared/api/generated/data-contracts';
  import { getSearchService } from '@/shared/api/api';


  const route = useRoute();
  const router = useRouter();

  const offersItems = ref<Item[]>([]);
  const filters = ref<SearchResponseFilters>({
    brands: ['Nissan/Infiniti'],
    vendors: [
      'Autodoc',
      'Emex',
      'Mikado Parts (API)',
      'IXORA',
      'АвтоПитер (API)',
      'ffdhfdh',
      'Tatparts',
      'Emex (API)',
      'Берг (API)',
      'Армтек (API)',
      'ПартКом (API)',
      'Mparts (API)',
    ],
    cities: [
      {
        id: 5,
        title: 'Партнерский склад',
      },
      {
        id: 11,
        title: 'Москва',
      },
      {
        id: 12,
        title: 'Набережные Челны',
      },
      {
        id: 14,
        title: 'Самара',
      },
      {
        id: 18,
        title: 'Склад выдачи',
      },
      {
        id: 19,
        title: 'Санкт-Петербург',
      },
      {
        id: 23,
        title: 'Оптовый склад',
      },
      {
        id: 25,
        title: 'NISSAN ЦС -1117',
      },
      {
        id: 26,
        title: 'Склад представительства',
      },
      {
        id: 27,
        title: '8250612 ЦС',
      },
      {
        id: 29,
        title: 'Ярославль',
      },
      {
        id: 30,
        title: 'Центральный склад',
      },
    ],
  });
  const pagination = ref<SearchPagination>({
    page: 1,
    pages: 9,
    has_next: true,
    has_prev: false,
    items_count: 0,
  });


  function handlePageSelected(page: number) {
    const vendorsString = route.query.vendors as string;
    const vendorsArray = vendorsString ? vendorsString.split(',') : [];

    const brandsString = route.query.brands as string;
    const brandsArray = brandsString ? brandsString.split(',') : [];

    const citiesString = route.query.cities as string;
    const citiesArray = citiesString ? citiesString.split(',').map(Number) : [];

    getSearchService({
      filters: {
        name: route.query?.denomination as string,
        article: route.query?.article as string,
        price: {
          from: Number(route.query?.priceFrom) || 0,
          to: Number(route.query?.priceTo) || 100000000000,
        },
        delivery: {
          from: Number(route.query?.countFrom) || 0,
          to: Number(route.query?.countTo) || 1000000000000000,
        },
      },
      exclude: {
        brand: brandsArray,
        vendor: vendorsArray,
        city_id: citiesArray,
      },
      search: route.query.search as string,
      page: page,
      page_size: 10,
      brand: route.query['active-pre-search'] as string,
    }).then((response) => {
      pagination.value = {
        items_count: response.items_count as number,
        has_next: response.has_next as boolean,
        has_prev: response.has_prev as boolean,
        page: response.page as number,
        pages: response.pages as number,
      };
      offersItems.value = response.items as Item[];
    });
  }

  const productItem = ref<Item>();

  const isProductCardOpen = ref(false);
  const isFilterCardOpen = ref(false);

  watch([isProductCardOpen, isFilterCardOpen], () => {
    if (isProductCardOpen.value && isFilterCardOpen.value) {
      isProductCardOpen.value = false;
    } else if (isFilterCardOpen.value && isProductCardOpen.value) {
      isFilterCardOpen.value = false;
    }
  });

  const isMobile = ref(false);
  const selectedAdvertisement = ref(false);

  defineEmits(['advertisementItems']);

  const checkIsMobile = () => {
    isMobile.value = window.innerWidth < 640;
  };

  onMounted(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
  });

  onMounted(() => {
    if (route.query.search) {
      router.push({
        name: 'advertisements',
        query: {
          search: route.query.search,
          'active-pre-search': route.query['active-pre-search'],
          'active-card': route.query['active-card'],
        },
      });
    }
  });

  function handleSearchSubmit(searchTerm: string) {
    router.push({
      name: 'advertisements',
      query: {
        search: searchTerm,
        'active-pre-search': route.query['active-pre-search'],
        'active-card': route.query['active-card']
      },
    });
  }

  function handleAdvertisementItems(advertisementsItems: Item[]) {
    offersItems.value = advertisementsItems;
    selectedAdvertisement.value = true;
  }

  function handleAdvertisementFilters(
    advertisementsFilters: SearchResponseFilters,
  ) {
    filters.value = advertisementsFilters;
    selectedAdvertisement.value = true;
  }

  function handleItemClick(item: Item) {
    router.push({
      path: route.fullPath,
      query: {
        ...route.query,
        'active-card': item.itemId,
      },
    });
    isProductCardOpen.value = true;
    isFilterCardOpen.value = false;
    productItem.value = item;
  }

  function handleFilteredItemsCame(items: Item[]) {
    offersItems.value = items;
    isFilterCardOpen.value = false;
  }

  function handleCloseProductCard() {
    isProductCardOpen.value = false;
  }
</script>

<template>
  <div class="flex flex-row bg-white">
    <div class="flex w-full flex-col items-center sm:max-w-[356px]">
      <Header
        v-if="!isProductCardOpen && isMobile && !isFilterCardOpen"
        @submitSearch="handleSearchSubmit" />
      <Header v-if="!isMobile" @submitSearch="handleSearchSubmit" />
      <div v-if="isMobile && selectedAdvertisement" class="w-full">
        <ProductCard
          v-if="productItem"
          class="inline-block"
          :product-item="productItem"
          :is-product-card-open="isProductCardOpen"
          @close-product-card="handleCloseProductCard" />
      </div>
      <div v-if="isMobile && isFilterCardOpen" class="w-full">
        <ProductCard
          v-if="productItem"
          class="inline-block"
          :product-item="productItem"
          :is-product-card-open="isProductCardOpen"
          @close-product-card="handleCloseProductCard" />
      </div>
      <div
        class="w-full flex-grow bg-[#F9FAFB]"
        v-if="
          isMobile &&
          selectedAdvertisement &&
          !isProductCardOpen &&
          !isFilterCardOpen
        ">
        <Offers
          v-model:pagination="pagination"
          @offer-clicked="handleItemClick"
          @open-filter="isFilterCardOpen = true"
          :offers-items="offersItems"
          @page-selected="handlePageSelected"
          class="flex w-full" />
      </div>
      <router-view
        v-if="!selectedAdvertisement && !isMobile"
        @advertisementItems="handleAdvertisementItems"
        @advertisementFilters="handleAdvertisementFilters"
        v-model:pagination="pagination" />
      <router-view
        v-if="!selectedAdvertisement && isMobile"
        @advertisementItems="handleAdvertisementItems"
        @advertisementFilters="handleAdvertisementFilters"
        v-model:pagination="pagination" />
      <router-view
        v-else-if="selectedAdvertisement && !isMobile"
        @advertisementItems="handleAdvertisementItems"
        @advertisementFilters="handleAdvertisementFilters"
        v-model:pagination="pagination" />
    </div>
    <div v-if="!isMobile" class="flex-grow bg-[#F9FAFB]">

      <Offers
        v-model:pagination="pagination"
        @offer-clicked="handleItemClick"
        @open-filter="isFilterCardOpen = true"
        :offers-items="offersItems"
        @page-selected="handlePageSelected"
        class="hidden w-full lg:flex" />

      <Offers
        v-if="!isFilterCardOpen && !isProductCardOpen"
        v-model:pagination="pagination"
        @offer-clicked="handleItemClick"
        @open-filter="isFilterCardOpen = true"
        :offers-items="offersItems"
        @page-selected="handlePageSelected"
        class="hidden sm:flex w-full lg:hidden" />

      <ProductCard
        v-if="isProductCardOpen && productItem && !isMobile && route.path === '/advertisements' && !isFilterCardOpen"
        :product-item="productItem"
        :is-product-card-open="isProductCardOpen"
        @close-product-card="handleCloseProductCard"
        class="hidden sm:flex lg:hidden"
      />

      <Filter
        v-if="isFilterCardOpen && !isMobile && route.path === '/advertisements' && !isProductCardOpen"
        v-model:filters="filters"
        @filtered-items-came="handleFilteredItemsCame"
        :is-filter-card-open="isFilterCardOpen"
        v-model:pagination="pagination"
        @close-filter-card="isFilterCardOpen = false"
        class="hidden sm:inline-block w-full lg:hidden"
      />
    </div>

    <div v-if="!isFilterCardOpen && !isProductCardOpen" class="hidden lg:flex h-screen bg-[#F9FAFB] w-full min-w-[360px] flex-col justify-between border-l border-[#D0D4DB] sm:w-[360px]">

    </div>
    <ProductCard
      v-if="productItem && !isMobile && route.path === '/advertisements'"
      :product-item="productItem"
      :is-product-card-open="isProductCardOpen"
      @close-product-card="handleCloseProductCard"
      class=" w-full flex sm:hidden lg:flex"
    />
    <Filter
      v-if="!isMobile"
      v-model:filters="filters"
      @filtered-items-came="handleFilteredItemsCame"
      :is-filter-card-open="isFilterCardOpen"
      v-model:pagination="pagination"
      @close-filter-card="isFilterCardOpen = false"
      class=" w-full inline-block sm:hidden lg:flex"
    />
  </div>
  <Filter
    v-if="isMobile"
    v-model:filters="filters"
    @filtered-items-came="handleFilteredItemsCame"
    :is-filter-card-open="isFilterCardOpen"
    v-model:pagination="pagination"
    @close-filter-card="isFilterCardOpen = false"
    class="w-full flex sm:hidden lg:inline-block"
  />
</template>
