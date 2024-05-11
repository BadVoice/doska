<script setup lang="ts">
  import { computed, nextTick, ref, watch } from 'vue';
  import { getButtonList } from '../lib/button-list';
  import { Button } from '@/shared/ui/button';
  import BurgerMenu from './burger-menu.vue';
  import Search from './assets/search.vue';
  import { Input } from '@/shared/ui/input';
  import { useRoute, useRouter } from 'vue-router';
  import { useDebounceFn } from '@vueuse/core';

  const route = useRoute();
  const router = useRouter();

  const isBurgerMenuOpen = ref(false);

  const visibleSearch = ref(false);
  const buttonList = getButtonList(visibleSearch);
  const formFocused = ref(false);
  const scrollableContainer = ref();

  function handleSubmitSearch(event: Event) {
    event.preventDefault();
    if (searchTerm.value !== '') {
      handleInput();
    }
  }

  const searchTerm = ref('');

  const emit = defineEmits(['submitSearch', 'submitLogin', 'createClicked']);

  const handleInput = useDebounceFn(() => {
    emit('submitSearch', searchTerm.value);
  }, 500);

  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    scrollableContainer.value.scrollBy({
      left: event.deltaY < 0 ? 30 : -30,
      behaviour: 'smooth',
    });
  }

  watch(visibleSearch, (newValue) => {
    if (newValue) {
      nextTick(() => {
        formFocused.value = true;
      });
      nextTick(() => {
        document.getElementById('search')?.focus();
        router.push('/search-history');
      });
    }
  });

  const activeButton = computed(() => {
    return buttonList.value.find((button) => button.link === route.path);
  });
</script>

<template>
  <div
    class="w-full flex-col items-center justify-between border-b border-r border-[#D0D4DB] md:max-w-[356px]">
    <div class="flex w-full items-center justify-between px-4 pt-4">
      <div v-if="!visibleSearch" class="flex flex-row items-center">
        <BurgerMenu v-model="isBurgerMenuOpen" />
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
          @click="visibleSearch = false"
          size="icon"
          variant="ghost">
          <img
            src="./assets/backIcon.svg"
            class="h-6 w-6 select-none"
            alt="arrow" />
        </Button>
      </RouterLink>
      <div v-if="!visibleSearch" class="flex items-center gap-0">
        <Button @click="visibleSearch = true" size="icon" variant="ghost">
          <Search />
        </Button>
        <Button @click="emit('submitLogin', true)" size="icon" variant="ghost">
          <img src="./assets/login.svg" alt="login" />
        </Button>
        <Button size="icon" variant="ghost" @click="$emit('createClicked')">
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
          @input="handleInput"
          id="search"
          type="text"
          @focus="formFocused = true"
          @blur="formFocused = false"
          class="border-0 py-0 focus:outline-none" />
      </form>
    </div>
    <div class="flex w-full items-center justify-between gap-6 py-4 pl-4">
      <div
        ref="scrollableContainer"
        class="no-scrollbar overflow-x-auto whitespace-nowrap"
        @wheel="handleWheel">
        <RouterLink
          v-for="button of buttonList"
          :key="button.label"
          :to="button?.link"
          class="mr-4 inline-block focus:outline-none">
          <Button
            variant="outline"
            :class="{
              'border-[#0017FC] bg-[#1778EA] bg-opacity-10 text-[#0017FC] hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10 hover:text-[#0017FC]':
                button.link === activeButton?.link,
              'border-[#D0D4DB] bg-[#F9FAFB] text-[#858FA3] hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10 hover:text-[#0017FC]':
                button.link !== activeButton?.link,
            }"
            class="max-h-[28px] rounded-lg"
            size="sm">
            {{ button.label }}
          </Button>
        </RouterLink>
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
