<script setup lang="ts">
  import {
    brandSelected,
    requestViewModeChanged,
  } from '@/pages/my-requests/model/my-requests-model';
  import { Button } from '@/shared/ui/button';
  import { Input } from '@/shared/ui/input';
  import {
    Pagination,
    PaginationEllipsis,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
  } from '@/shared/ui/pagination';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useDebounceFn } from '@vueuse/core';
  import { useUnit } from 'effector-vue/composition';
  import { computed, onMounted, ref } from 'vue';
  import { getBrands, mounted } from '../model/brand-model';

  const handleMount = useUnit(mounted);
  const { data: allBrands } = useUnit(getBrands);
  const changeViewMode = useUnit(requestViewModeChanged);
  const handleBrandSelected = useUnit(brandSelected);

  const handleClick = (brand: any) => {
    handleBrandSelected(brand);
    changeViewMode('offers');
  };

  onMounted(handleMount);

  const page = ref(1);
  const pageLimit = 30;
  const searchTerm = ref('');

  const brands = computed(() => {
    return allBrands.value?.data
      .filter((brand) => brand?.name?.includes(searchTerm.value))
      .slice((page.value - 1) * pageLimit, page.value * pageLimit);
  });

  const handleInput = useDebounceFn(
    (event: Event & { target: HTMLInputElement }) => {
      searchTerm.value = event.target.value;
    },
    500,
  );
</script>

<template>
  <div
    class="flex h-[56px] w-full cursor-default items-start gap-x-2 border-b border-[#D0D4DB] p-4 text-[18px] font-semibold">
    <img
      class="h-7 w-7 cursor-pointer"
      src="./assets/backIcon.svg "
      alt="Back"
      @click="changeViewMode(null)" />
    <p>Выбор бренда по заявке</p>
  </div>
  <ScrollArea class="h-[calc(100vh-56px)]">
    <form @submit.prevent class="mt-4 w-full px-5">
      <Input
        @input="handleInput"
        class="h-12 w-full text-[16px]"
        placeholder="Поиск" />
    </form>
    <div class="flex w-full flex-col px-5 py-4 text-center">
      <div
        v-if="brands"
        v-for="brand in brands"
        @click="handleClick(brand)"
        class="group mt-4 h-full max-h-[68px] w-full rounded-md border-2 border-[#D0D4DB] px-4 transition-all duration-75 hover:border-[#0017FC]">
        <p class="h-full w-full p-4 text-[14px] font-normal">
          {{ brand?.name }}
        </p>
      </div>
    </div>
    <Pagination
      v-slot="{ page }"
      :total="brands?.length"
      :sibling-count="1"
      show-edges
      :items-per-page="pageLimit"
      :page="page"
      @update:page="(data) => (page = data)"
      class="mx-auto w-fit"
      :default-page="1">
      <PaginationList
        v-slot="{ items }"
        class="mx-auto mb-4 flex items-center gap-1">
        <PaginationPrev />

        <template v-for="(item, index) in items">
          <PaginationListItem
            v-if="item.type === 'page'"
            :key="index"
            :value="item.value"
            as-child>
            <Button
              class="h-10 w-10 p-0"
              :variant="item.value === page ? 'default' : 'outline'">
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
      </PaginationList>
    </Pagination>
  </ScrollArea>
</template>
