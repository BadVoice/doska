<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import { CreateAdvertisement } from '@/features/create-advertisement';
  import { Filter } from '@/features/filter';
  import { OfferCard, ProductCard } from '@/pages/home';
  import type { Item } from '@/shared/api/generated/Api';
  import { Auth } from '@/widgets/auth';
  import { Header } from '@/widgets/header';
  import { ManuallyAddOffer, Offers, Search } from '@/widgets/offers';
  import { Sidebar } from '@/widgets/sidebar';

  import { $selectedAdvertisement } from '@/entities/advertisement';
  import { searchQuery } from '@/entities/offer';
  import { $showCreateAdvertisement } from '@/features/create-advertisement';
  import {
    $currentPage,
    $filteredRequests,
    $requestViewMode,
    $searchQS,
    RequestHistory,
    requestViewModeChanged,
    SelectBrand,
  } from '@/pages/my-requests';
  import { Toaster } from '@/shared/ui/toast';
  import {
    $showAuth,
    addCompanyClicked,
    handleShowAuthChanged,
  } from '@/widgets/auth';
  import {
    ChangeCompany,
    changeCompanyVisibleChanged,
  } from '@/widgets/change-company';
  import { $showAddOfferModal } from '@/widgets/offers';
  import { useUnit } from 'effector-vue/composition';
  import { offerClicked } from '../entities/offer/model/offers-model';
  import { type Offer } from '../shared/api/generated/Api';
  import type { BidWithName } from '@/entities/requests';

  const route = useRoute();
  const router = useRouter();

  const showAddOfferModal = useUnit($showAddOfferModal);
  const requestViewMode = useUnit($requestViewMode);
  const selectedAdvertisement = useUnit($selectedAdvertisement);
  const changeSwitchCompanyVisible = useUnit(changeCompanyVisibleChanged);
  const searchQS = useUnit($searchQS);
  const selectedPage = useUnit($currentPage);
  const filteredRequests = useUnit($filteredRequests);

  const changeRequestViewMode = useUnit(requestViewModeChanged);

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
      search: searchQS.value?.search ?? '',
      page: page,
      page_size: 10,
      brand: searchQS.value?.brand ?? '',
    });
  }

  const productItem = ref<Item>();
  const offerItem = ref<Offer>();

  const isProductCardOpen = ref(false);
  const isFilterCardOpen = ref(false);
  const isSidebarOpen = ref(false);
  const handleAddCompany = useUnit(addCompanyClicked);
  const isCreateAdvertisementOpen = useUnit($showCreateAdvertisement);

  watch([isProductCardOpen, isFilterCardOpen], () => {
    if (isProductCardOpen.value && isFilterCardOpen.value) {
      isProductCardOpen.value = false;
    } else if (isFilterCardOpen.value && isProductCardOpen.value) {
      isFilterCardOpen.value = false;
    }
  });

  const isMobile = ref(false);
  const isAuthOpen = useUnit($showAuth);
  const changeAuthVisibility = useUnit(handleShowAuthChanged);

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

  function handleOfferClick(item: Offer) {
    router.push({
      path: route.fullPath,
      query: {
        ...route.query,
        'active-card': item.id,
      },
    });
    isProductCardOpen.value = true;
    isFilterCardOpen.value = false;
    offerItem.value = item;
  }

  offerClicked.watch(handleOfferClick);

  function handleCloseProductCard() {
    isProductCardOpen.value = false;
  }

  function handleNavigate(
    destination: 'my-requests' | 'my-offers' | 'change-company' | 'add-company',
  ) {
    if (destination === 'add-company') {
      handleAddCompany();
    } else if (destination === 'my-requests') {
      router.push('/');
    } else if (destination === 'change-company') {
      changeSwitchCompanyVisible(true);
    } else {
      router.push('/');
    }
    isSidebarOpen.value = false;
  }

  function handleCloseOffers() {
    changeRequestViewMode(null);
  }
</script>

<template>
  <Toaster />
  <div class="flex flex-row bg-white">
    <div class="flex h-[100vh] w-full flex-col items-center sm:max-w-[356px]">
      <Header
        v-if="
          (isMobile &&
            !isProductCardOpen &&
            !isFilterCardOpen &&
            !isAuthOpen &&
            !isSidebarOpen &&
            !isCreateAdvertisementOpen) ||
          (!isMobile && !isAuthOpen && !isSidebarOpen)
        "
        :requests="filteredRequests as BidWithName[]"
        @submit-login="changeAuthVisibility()"
        @open-sidebar="isSidebarOpen = true" />

      <div
        v-if="
          isMobile &&
          (selectedAdvertisement || isFilterCardOpen || isProductCardOpen)
        "
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
        <Search
          :current-page="selectedPage"
          @close-offers="handleCloseOffers"
          v-if="
            requestViewMode === 'search' &&
            !isFilterCardOpen &&
            !isProductCardOpen &&
            !isSidebarOpen &&
            !isAuthOpen
          "
          @offer-clicked="handleItemClick"
          @open-filter="isFilterCardOpen = true"
          @page-selected="handlePageSelected"
          class="flex w-full" />
      </div>
      <router-view
        v-if="
          (!isAuthOpen &&
            !isSidebarOpen &&
            isMobile &&
            !isProductCardOpen &&
            !isFilterCardOpen &&
            !isAuthOpen &&
            !isSidebarOpen &&
            !requestViewMode &&
            !isCreateAdvertisementOpen) ||
          (!isAuthOpen && !isMobile && !isSidebarOpen)
        " />
      <SelectBrand
        v-if="
          isMobile && !isSidebarOpen && requestViewMode === 'selectBrand'
        " />
      <Auth
        v-if="isAuthOpen"
        @submit-close-auth="changeAuthVisibility(false)" />

      <Sidebar
        v-if="isSidebarOpen && !isAuthOpen"
        @close-sidebar="isSidebarOpen = false"
        @navigate="handleNavigate" />
      <ChangeCompany />
      <CreateAdvertisement v-if="isCreateAdvertisementOpen" />
    </div>

    <div v-if="!isMobile" class="w-full flex-grow bg-[#F9FAFB]">
      <RequestHistory v-if="requestViewMode === 'history'" />
      <SelectBrand v-else-if="requestViewMode === 'selectBrand'" />

      <div class="flex w-full min-w-full lg:hidden">
        <Search
          :current-page="selectedPage"
          @close-offers="handleCloseOffers"
          v-if="
            requestViewMode === 'search' &&
            !isFilterCardOpen &&
            !isProductCardOpen &&
            !isAuthOpen
          "
          @offer-clicked="handleItemClick"
          @open-filter="isFilterCardOpen = true"
          @page-selected="handlePageSelected"
          class="hidden w-full sm:flex lg:hidden" />
      </div>

      <div class="hidden w-full min-w-full lg:flex">
        <Search
          :current-page="selectedPage"
          @close-offers="handleCloseOffers"
          v-if="requestViewMode === 'search' && !isAuthOpen"
          @offer-clicked="handleItemClick"
          @open-filter="isFilterCardOpen = true"
          @page-selected="handlePageSelected"
          class="hidden w-full sm:flex lg:hidden" />
        <Offers
          @close-offers="handleCloseOffers"
          v-if="requestViewMode === 'offers' && !isAuthOpen"
          @offer-clicked="handleItemClick"
          @open-filter="isFilterCardOpen = true"
          class="hidden w-full sm:flex lg:hidden" />
      </div>

      <ProductCard
        v-if="isProductCardOpen && productItem && !isFilterCardOpen"
        :product-item="productItem"
        :is-product-card-open="isProductCardOpen"
        @close-product-card="handleCloseProductCard"
        class="hidden sm:flex lg:hidden" />

      <OfferCard
        v-if="isProductCardOpen && offerItem && !isFilterCardOpen"
        :product-item="offerItem"
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
      <!--      <Filter-->
      <!--        v-if="isFilterCardOpen && !isMobile && !isProductCardOpen"-->
      <!--        :is-filter-card-open="isFilterCardOpen"-->
      <!--        @close-filter-card="isFilterCardOpen = false"-->
      <!--        class="hidden w-full sm:inline-block xl:hidden" />-->
    </div>
    <div
      v-if="!isFilterCardOpen && !isProductCardOpen && !showAddOfferModal"
      class="hidden h-screen w-full min-w-[360px] flex-col justify-between border-l border-[#D0D4DB] bg-[#F9FAFB] sm:w-[360px] lg:flex"></div>
    <ProductCard
      v-if="productItem && !isMobile && !showAddOfferModal"
      :product-item="productItem"
      :is-product-card-open="isProductCardOpen"
      @close-product-card="handleCloseProductCard"
      class="flex w-full sm:hidden lg:flex" />
    <OfferCard
      v-if="offerItem && !isMobile && !showAddOfferModal"
      :product-item="offerItem"
      :is-product-card-open="isProductCardOpen"
      @close-product-card="handleCloseProductCard"
      class="flex w-full sm:hidden lg:flex" />

    <ManuallyAddOffer v-if="!isMobile && showAddOfferModal" />
    <Filter
      v-if="!isMobile && !showAddOfferModal && !isAuthOpen"
      :is-filter-card-open="isFilterCardOpen"
      @close-filter-card="isFilterCardOpen = false"
      class="inline-block w-full sm:hidden lg:flex" />
  </div>
  <Filter
    v-if="isMobile && !isAuthOpen"
    :is-filter-card-open="isFilterCardOpen"
    @close-filter-card="isFilterCardOpen = false"
    class="flex w-full sm:hidden lg:inline-block" />
</template>
