<script setup lang="ts">
  import { $selectedCompany } from '@/entities/company';
  import { getOrders } from '@/entities/order';
  import { myRequestsQuery, type BidWithName } from '@/entities/requests';
  import { $isAuthorized } from '@/entities/session';
  import { createBidVisibilityChanged } from '@/features/create-advertisement';
  import { createReturnMutation, getReturns } from '@/pages/my-requests';
  import { cn } from '@/shared/lib';
  import { Button } from '@/shared/ui/button';
  import { Input } from '@/shared/ui/input';
  import { useUnit } from 'effector-vue/composition';
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
  import { nextTick, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { getButtonList } from '../lib/button-list';
  import {
    $selectedSortType,
    $showSearch,
    searchTermInputed,
    searchVisibilityChanged,
    sortTypeSelected,
  } from '../model/header-modal';
  import Search from './assets/search.vue';
  import BurgerMenu from './burger-menu.vue';

  withDefaults(
    defineProps<{
      requests: BidWithName[];
    }>(),
    {
      requests: () => [],
    },
  );

  const router = useRouter();

  const searchTerm = ref('');

  const handleSubmit = useUnit(searchTermInputed);

  const isBurgerMenuOpen = ref(false);

  const visibleSearch = useUnit($showSearch);
  const changeSearchVisible = useUnit(searchVisibilityChanged);
  const buttonList = getButtonList(visibleSearch);
  const formFocused = ref(false);
  const scrollableContainer = ref();
  const scrolledButtonIndex = ref(0);

  const selectedCompany = useUnit($selectedCompany);
  const { data: orders } = useUnit(getOrders);

  const { data: returns } = useUnit(getReturns);

  const { data: requestsData } = useUnit(myRequestsQuery);

  const handleSortTypeSelected = useUnit(sortTypeSelected);
  const selectedSortType = useUnit($selectedSortType);

  const handleCreateClicked = useUnit(createBidVisibilityChanged);

  const userAuthorized = useUnit($isAuthorized);

  function handleSubmitSearch(event: Event) {
    event.preventDefault();
    handleSubmit(searchTerm.value);
  }

  const emit = defineEmits([
    'submitSearch',
    'submitLogin',
    'openSidebar',
    'buttonClicked',
  ]);

  watch(visibleSearch, (newValue) => {
    if (newValue) {
      nextTick(() => {
        formFocused.value = true;
      });
      nextTick(() => {
        document.getElementById('search')?.focus();
        router.push('/advertisements');
      });
    }
  });

  createReturnMutation.finished.success.watch(() => {
    scrollToButton(5);
    handleSortTypeSelected(-5);
  });

  function scrollToButton(index: number) {
    if (!scrollableContainer.value) {
      console.error('scrollableContainer is null!');
      return;
    }

    if (index > buttonList.value.length - 1 || index < 0) {
      return;
    }
    scrolledButtonIndex.value = index;

    const buttonElement = scrollableContainer.value.children[index];
    const buttonWidth = buttonElement.offsetWidth;
    const containerWidth = scrollableContainer.value.offsetWidth;
    const scrollPosition = scrollableContainer.value.scrollLeft;

    const targetPosition = buttonElement.offsetLeft;

    const offset = 170;

    if (targetPosition < scrollPosition) {
      scrollableContainer.value.scrollTo({
        left: targetPosition - offset,
        behavior: 'smooth',
      });
    } else if (targetPosition > scrollPosition + containerWidth - buttonWidth) {
      scrollableContainer.value.scrollTo({
        left: targetPosition - containerWidth + buttonWidth + offset,
        behavior: 'smooth',
      });
    }
  }

  const CountDictionary = Object.freeze({
    0: 'count_created',
    1: 'count_published',
    2: 'count_finished',
    3: 'count_archived',
  });
</script>

<template>
  <div
    class="w-full flex-col items-center justify-between border-b border-r border-[#D0D4DB] md:max-w-[356px]">
    <div class="flex w-full items-center justify-between px-4 pt-4">
      <div v-if="!visibleSearch" class="flex flex-row items-center">
        <BurgerMenu @click="emit('openSidebar')" v-model="isBurgerMenuOpen" />
        <div class="ml-4 flex w-[5.75rem] items-center">
          <RouterLink to="/" class="flex w-full items-center">
            <img src="./assets/logo.svg" alt="logo" class="logo w-full" />
          </RouterLink>
        </div>
      </div>
      <RouterLink to="/">
        <Button
          class="-ml-2"
          v-if="visibleSearch"
          @click="changeSearchVisible(false)"
          size="icon"
          variant="ghost">
          <img
            src="./assets/backIcon.svg"
            class="h-6 w-6 select-none"
            alt="arrow" />
        </Button>
      </RouterLink>
      <div v-if="!visibleSearch" class="flex items-center gap-0">
        <Button @click="changeSearchVisible(true)" size="icon" variant="ghost">
          <Search />
        </Button>
        <Button
          @click="emit('submitLogin', true)"
          v-if="!userAuthorized"
          size="icon"
          variant="ghost">
          <img src="./assets/login.svg" alt="login" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          class="w-fit"
          @click="handleCreateClicked">
          <img src="./assets/create.svg" alt="create" />
        </Button>
      </div>
      <form
        @submit="handleSubmitSearch"
        v-if="visibleSearch"
        :style="{
          border: formFocused ? '2px solid #0017FC' : '2px solid #D0D4DB',
        }"
        class="relative ml-2 flex w-full max-w-sm items-center gap-x-2 rounded-xl border-2 px-2 transition-all duration-100">
        <Search
          :color="formFocused ? '#0015FA' : '#858FA3'"
          @click="handleSubmitSearch" />
        <Input
          :key="visibleSearch ? 'true' : 'false'"
          v-model="searchTerm"
          @keydown.enter="handleSubmitSearch"
          @input="handleSubmitSearch"
          id="search"
          type="text"
          @focus="formFocused = true"
          @blur="formFocused = false"
          class="border-0 py-0 focus:outline-none" />
      </form>
    </div>
    <div class="flex items-center px-1">
      <Button
        class="h-full w-fit cursor-pointer p-0"
        variant="ghost"
        @click="scrollToButton(scrolledButtonIndex - 2)">
        <ChevronLeft />
      </Button>

      <div class="flex w-full items-center py-4 pr-4">
        <div
          ref="scrollableContainer"
          class="no-scrollbar relative overflow-x-auto whitespace-nowrap">
          <RouterLink
            v-for="(button, index) in buttonList"
            :key="button.label"
            :to="button?.link"
            @click="scrollToButton(index)"
            class="mr-4 focus:outline-none">
            <Button
              variant="outline"
              @click="
                () => {
                  handleSortTypeSelected(button.status);
                  emit('buttonClicked', index);
                }
              "
              :class="
                cn(
                  'max-h-[28px] rounded-lg',
                  selectedSortType === button.status &&
                    'border-[#0017FC] bg-[#1778EA] bg-opacity-10 text-[#0017FC] hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10 hover:text-[#0017FC]',
                )
              "
              size="sm">
              {{ button.label }}
              <template v-if="button.link === '/' && requests?.length">
                <template v-if="button.status >= 0">
                  {{ button.status }}
                  {{
                    requestsData &&
                    '(' +
                      requestsData?.[
                        CountDictionary[button.status as 0 | 1 | 2 | 3]
                      ] +
                      ')'
                  }}
                </template>
                <template v-else-if="button.status === -1">
                  {{
                    requests &&
                    '(' +
                      requests.filter((r) =>
                        selectedCompany?.id
                          ? r.company === selectedCompany?.id
                          : true,
                      ).length +
                      ')'
                  }}
                </template>
                <template v-else-if="button.status === -3">
                  {{
                    orders?.data &&
                    '(' +
                      orders.data.filter((o) =>
                        selectedCompany?.id
                          ? o.company === selectedCompany?.id
                          : true,
                      )?.length +
                      ')'
                  }}
                </template>
                <template
                  v-else-if="button.status === -5 || button.status === -6">
                  {{
                    returns &&
                    '(' +
                      returns
                        .filter((r) =>
                          button.status === -6
                            ? r.status === 1
                            : r.status === 0,
                        )
                        .filter((r) =>
                          selectedCompany?.id
                            ? r.company === selectedCompany?.id
                            : true,
                        ).length +
                      ')'
                  }}
                </template>
                <template v-else>
                  {{ orders?.data?.length }}
                </template>
              </template>
            </Button>
          </RouterLink>
        </div>

        <Button
          class="h-full w-fit cursor-pointer p-0"
          variant="ghost"
          @click="scrollToButton(scrolledButtonIndex + 2)">
          <ChevronRight />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
  .no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
  }
  .no-scrollbar::-webkit-scrollbar {
    @apply hidden w-0;
  }
</style>
