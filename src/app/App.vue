<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
  import { onMounted, ref, watch } from 'vue';

  import { ProductCard } from '@/pages/home';
  import { Header } from '@/widgets/header';
  import { Filter } from '@/features/filter';
  import { Auth } from '@/widgets/auth';
  import { ManuallyAddOffer, Offers } from '@/widgets/offers';
  import { CreateAdvertisement } from '@/features/create-advertisement';
  import type {
    Item,
    SearchResponse,
    SearchResponseFilters,
  } from '@/shared/api/generated/Api';


  import {$api, $qwepApi} from '@/shared/api/api';
  import {Sidebar} from "@/widgets/sidebar";
  
  import { useUnit } from 'effector-vue/composition';
  import { $showAddOfferModal } from '@/widgets/offers/model/offers-model';
  import { $requestHistoryOpened, RequestHistory } from '@/pages/my-requests';


  const route = useRoute();
  const router = useRouter();

  const showAddOfferModal = useUnit($showAddOfferModal);
  const showRequestHistory = useUnit($requestHistoryOpened);

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
  const pagination = ref<
    Pick<
      SearchResponse,
      'has_next' | 'has_prev' | 'page' | 'items' | 'items_count' | 'pages'
    >
  >({
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

    $qwepApi.search
      .getSearch({
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
      })
      .then((response) => {
        pagination.value = {
          items_count: response.data.items_count,
          has_next: !!response.data.has_next,
          has_prev: !!response.data.has_prev,
          page: response.data.page,
          pages: response.data.pages,
        };
        offersItems.value = response.data.items as Item[];
      });
  }

  const productItem = ref<Item>();

  const isProductCardOpen = ref(false);
  const isFilterCardOpen = ref(false);
  const isCreateAdvertisementOpen = ref(false);
  const isSidebarOpen = ref(false);

  watch([isProductCardOpen, isFilterCardOpen], () => {
    if (isProductCardOpen.value && isFilterCardOpen.value) {
      isProductCardOpen.value = false;
    } else if (isFilterCardOpen.value && isProductCardOpen.value) {
      isFilterCardOpen.value = false;
    }
  });

  const isMobile = ref(false);
  const isAuthOpen = ref(false);
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
        'active-card': route.query['active-card'],
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

  function handleRequestsData(data: {
    list: Item[];
    filters: SearchResponseFilters;
    pagination: Pick<
      SearchResponse,
      'has_next' | 'has_prev' | 'page' | 'items' | 'items_count' | 'pages'
    >;
  }) {
    console.log(data);
    offersItems.value = data.list;
    filters.value = data.filters;
    pagination.value = data.pagination;
  }

  onMounted(async () => {
   const siteInfo = await $api.siteInfo.getSiteInfo()
    console.log(siteInfo.data)
  })

  function handleNavigate(destination: string) {
    if (destination === 'add-company') {
      isAuthOpen.value = true;
    } else if (destination === 'my-requests') {
      router.push('/');
      isSidebarOpen.value = false;

    }
    else {
      router.push('/');
      isSidebarOpen.value = false;
      console.log('false')
    }


  }
</script>

<template>
  <div class="flex flex-row bg-white">
      <div class="flex w-full flex-col items-center sm:max-w-[356px]">
      <Header
        v-if="
          isMobile &&
          !isProductCardOpen &&
          !isFilterCardOpen &&
          !isAuthOpen &&
          !isCreateAdvertisementOpen
        "
        @submitSearch="handleSearchSubmit"
        @submit-login="isAuthOpen = true"
        @create-clicked="isCreateAdvertisementOpen = true" />
      <Header
        v-if="!isMobile && !isAuthOpen"
        @submitSearch="handleSearchSubmit"
        @submit-login="isAuthOpen = true"
        @create-clicked="isCreateAdvertisementOpen = true" />
      <div
        v-if="isMobile && (selectedAdvertisement || isFilterCardOpen)"
        class="w-full">
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
        v-if="!isAuthOpen && !isFilterCardOpen && !isSidebarOpen"
        @handle-data="handleRequestsData"
        @advertisementItems="handleAdvertisementItems"
        @advertisementFilters="handleAdvertisementFilters"
        v-model:pagination="pagination" />
      <Auth v-if="isAuthOpen" @submit-close-auth="isAuthOpen = false" />
      <Sidebar v-if="isSidebarOpen" @close-sidebar="isSidebarOpen = false" @navigate="handleNavigate" />
      <CreateAdvertisement
        v-if="isCreateAdvertisementOpen"
        @close="isCreateAdvertisementOpen = false" />
    </div>

    <div v-if="!isMobile" class="flex-grow bg-[#F9FAFB]">
      <Offers
        v-model:pagination="pagination"
        @offer-clicked="handleItemClick"
        @open-filter="isFilterCardOpen = true"
        :offers-items="offersItems"
        @page-selected="handlePageSelected"
        class="hidden w-full lg:flex" />

      <RequestHistory v-if="showRequestHistory" />

      <Offers
        v-if="!isFilterCardOpen && !isProductCardOpen"
        v-model:pagination="pagination"
        @offer-clicked="handleItemClick"
        @open-filter="isFilterCardOpen = true"
        :offers-items="offersItems"
        @page-selected="handlePageSelected"
        class="hidden w-full sm:flex lg:hidden" />

      <ProductCard
        v-if="
          isProductCardOpen &&
          productItem &&
          !isMobile &&
          route.path === '/advertisements' &&
          !isFilterCardOpen
        "
        :product-item="productItem"
        :is-product-card-open="isProductCardOpen"
        @close-product-card="handleCloseProductCard"
        class="hidden sm:flex lg:hidden" />

      <ManuallyAddOffer
        v-if="
          showAddOfferModal &&
          !isMobile &&
          route.path === 'advertisements' &&
          !isProductCardOpen &&
          !isFilterCardOpen
        " />
      <Filter
        v-if="
          isFilterCardOpen &&
          !isMobile &&
          route.path === '/advertisements' &&
          !isProductCardOpen
        "
        v-model:filters="filters"
        @filtered-items-came="handleFilteredItemsCame"
        :is-filter-card-open="isFilterCardOpen"
        v-model:pagination="pagination"
        @close-filter-card="isFilterCardOpen = false"
        class="hidden w-full sm:inline-block lg:hidden" />
    </div>
    <div
      v-if="!isFilterCardOpen && !isProductCardOpen && !showAddOfferModal"
      class="hidden h-screen w-full min-w-[360px] flex-col justify-between border-l border-[#D0D4DB] bg-[#F9FAFB] sm:w-[360px] lg:flex"></div>
    <ProductCard
      v-if="
        productItem &&
        !isMobile &&
        !showAddOfferModal &&
        route.path === '/advertisements'
      "
      :product-item="productItem"
      :is-product-card-open="isProductCardOpen"
      @close-product-card="handleCloseProductCard"
      class="flex w-full sm:hidden lg:flex" />

    <ManuallyAddOffer v-if="!isMobile && showAddOfferModal" />
    <Filter
      v-if="!isMobile && !showAddOfferModal"
      v-model:filters="filters"
      @filtered-items-came="handleFilteredItemsCame"
      :is-filter-card-open="isFilterCardOpen"
      v-model:pagination="pagination"
      @close-filter-card="isFilterCardOpen = false"
      class="inline-block w-full sm:hidden lg:flex" />
  </div>
  <Filter
    v-if="isMobile"
    v-model:filters="filters"
    @filtered-items-came="handleFilteredItemsCame"
    :is-filter-card-open="isFilterCardOpen"
    v-model:pagination="pagination"
    @close-filter-card="isFilterCardOpen = false"
    class="flex w-full sm:hidden lg:inline-block" />
</template>
