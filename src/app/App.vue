<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
  import { onMounted, ref, watch } from 'vue';

  import { ProductCard } from '@/pages/home';
  import { Header } from '@/widgets/header';
  import { Filter } from '@/features/filter';
  import { Auth } from '@/widgets/auth';
  import { ManuallyAddOffer, Offers } from '@/widgets/offers';
  import { CreateAdvertisement } from '@/features/create-advertisement';
  import type { Item } from '@/shared/api/generated/Api';
  import { Sidebar } from '@/widgets/sidebar';

  import { useUnit } from 'effector-vue/composition';
  import { $showAddOfferModal } from '@/widgets/offers/model/offers-model';
  import { RequestHistory, SelectBrand } from '@/pages/my-requests';
  import { CompanyForm } from '@/widgets/company-form';
  import { $requestViewMode } from '@/pages/my-requests/model/my-requests-model';
  import { searchQuery } from '@/entities/offer';
  import { $selectedAdvertisement } from '@/entities/advertisement';

  const route = useRoute();
  const router = useRouter();

  const showAddOfferModal = useUnit($showAddOfferModal);
  const requestViewMode = useUnit($requestViewMode);
  const selectedAdvertisement = useUnit($selectedAdvertisement);

  const { start: search } = useUnit(searchQuery);

  function handlePageSelected(page: number) {
    const vendorsString = route.query.vendors as string;
    const vendorsArray = vendorsString ? vendorsString.split(',') : [];

    const brandsString = route.query.brands as string;
    const brandsArray = brandsString ? brandsString.split(',') : [];

    const citiesString = route.query.cities as string;
    const citiesArray = citiesString ? citiesString.split(',').map(Number) : [];

    search({
      filters: {
        name: route.query?.denomination?.toString() ?? '',
        article: route.query?.article?.toString() ?? '',
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
      search: selectedAdvertisement.value?.article ?? '',
      page: page,
      page_size: 10,
      brand: selectedAdvertisement.value?.brand ?? '',
    });
  }

  const productItem = ref<Item>();

  const isProductCardOpen = ref(false);
  const isFilterCardOpen = ref(false);
  const isCreateAdvertisementOpen = ref(false);
  const isSidebarOpen = ref(false);
  const isCompanyOpen = ref(false);

  watch([isProductCardOpen, isFilterCardOpen], () => {
    if (isProductCardOpen.value && isFilterCardOpen.value) {
      isProductCardOpen.value = false;
    } else if (isFilterCardOpen.value && isProductCardOpen.value) {
      isFilterCardOpen.value = false;
    }
  });

  const isMobile = ref(false);
  const isAuthOpen = ref(false);

  const lgScreen = ref(false);

  onMounted(() => {
    lgScreen.value = window.innerWidth >= 1400;
  });

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
        query: {
          search: route.query.search,
          'active-pre-search': route.query['active-pre-search'],
          'active-card': route.query['active-card'],
        },
      });
    }
  });

  function handleItemClick(item: Item) {
    console.log('click on item');
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

  function handleCloseProductCard() {
    isProductCardOpen.value = false;
  }

  function handleNavigate(destination: string) {
    if (destination === 'add-company') {
      isCompanyOpen.value = true;
    } else if (destination === 'my-requests') {
      router.push('/');
      isSidebarOpen.value = false;
    } else {
      router.push('/');
      isSidebarOpen.value = false;
    }
  }
</script>

<template>
  <div class="flex flex-row bg-white">
    <div
      class="flex max-h-[100vh] w-full flex-col items-center sm:max-w-[356px]">
      <Header
        v-if="
          isMobile &&
          !isProductCardOpen &&
          !isFilterCardOpen &&
          !isAuthOpen &&
          !isSidebarOpen &&
          !isCreateAdvertisementOpen
        "
        @submit-login="isAuthOpen = true"
        @open-sidebar="isSidebarOpen = true"
        @create-clicked="isCreateAdvertisementOpen = true" />
      <Header
        v-if="!isMobile && !isAuthOpen && !isSidebarOpen"
        @submit-login="isAuthOpen = true"
        @open-sidebar="isSidebarOpen = true"
        @create-clicked="isCreateAdvertisementOpen = true" />
      <div
        v-if="isMobile && !isProductCardOpen && !isFilterCardOpen"
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
        v-if="isMobile && !isProductCardOpen && !isFilterCardOpen">
        <Offers
          v-if="
            requestViewMode === 'offers' &&
            !isFilterCardOpen &&
            !isProductCardOpen
          "
          @offer-clicked="handleItemClick"
          @open-filter="isFilterCardOpen = true"
          @page-selected="handlePageSelected"
          class="flex w-full" />
      </div>
      <router-view v-if="!isAuthOpen" />
      <SelectBrand v-if="isMobile && requestViewMode === 'selectBrand'" />
      <Auth v-if="isAuthOpen" @submit-close-auth="isAuthOpen = false" />
      <CompanyForm
        v-if="isCompanyOpen"
        @submit-close-company="isCompanyOpen = false" />
      <Sidebar
        v-if="isSidebarOpen"
        @close-sidebar="isSidebarOpen = false"
        @navigate="handleNavigate" />
      <CreateAdvertisement
        v-if="isCreateAdvertisementOpen"
        @close="isCreateAdvertisementOpen = false" />
    </div>

    <div v-if="!isMobile" class="flex-grow bg-[#F9FAFB] w-full">
      <RequestHistory v-if="requestViewMode === 'history'" />
      <SelectBrand v-else-if="requestViewMode === 'selectBrand'" />
      <Offers
        v-if="requestViewMode === 'offers'"
        @offer-clicked="handleItemClick"
        @open-filter="isFilterCardOpen = true"
        @page-selected="handlePageSelected"
        class="hidden w-full sm:flex lg:hidden" />

      <ProductCard
        v-if="
          isProductCardOpen && productItem && !isFilterCardOpen
        "
        :product-item="productItem"
        :is-product-card-open="isProductCardOpen"
        @close-product-card="handleCloseProductCard"
        class="hidden sm:flex lg:hidden" />

      <ManuallyAddOffer
        v-if="
          showAddOfferModal &&
          !isMobile &&
          route.path === '/advertisements' &&
          !isProductCardOpen &&
          !isFilterCardOpen
        " />
      <Filter
        v-if="
          isFilterCardOpen &&
          !isMobile &&
          !isProductCardOpen
        "
        :is-filter-card-open="isFilterCardOpen"
        @close-filter-card="isFilterCardOpen = false"
        class="hidden w-full sm:inline-block xl:hidden" />
    </div>
    <div
      v-if="!isFilterCardOpen && !isProductCardOpen && !showAddOfferModal"
      class="hidden h-screen w-full min-w-[360px] flex-col justify-between border-l border-[#D0D4DB] bg-[#F9FAFB] sm:w-[360px] lg:flex"></div>
    <ProductCard
      v-if="
        productItem &&
        !isMobile &&
        !showAddOfferModal
      "
      :product-item="productItem"
      :is-product-card-open="isProductCardOpen"
      @close-product-card="handleCloseProductCard"
      class="flex w-full sm:hidden lg:flex" />

    <ManuallyAddOffer v-if="!isMobile && showAddOfferModal" />
    <Filter
      v-if="!isMobile && !showAddOfferModal"
      :is-filter-card-open="isFilterCardOpen"
      @close-filter-card="isFilterCardOpen = false"
      class="inline-block w-full sm:hidden lg:flex" />
  </div>
  <Filter
    v-if="isMobile"
    :is-filter-card-open="isFilterCardOpen"
    @close-filter-card="isFilterCardOpen = false"
    class="flex w-full sm:hidden lg:inline-block" />
</template>
