<script setup lang="ts">
import {
  brandSelected,
  requestViewModeChanged,
} from '@/pages/my-requests/model/my-requests-model';
import { useUnit } from 'effector-vue/composition';
  import { onMounted } from 'vue';

  import {getBrands, mounted} from "@/pages/my-requests/model/brand-model";
  import type {Brand} from "@/shared/api/generated/Api";

  const handleMount = useUnit(mounted);
  const { data: brands } = useUnit(getBrands);
  const changeViewMode = useUnit(requestViewModeChanged);
  const handleBrandSelected = useUnit(brandSelected);

  const handleClick = (brand: Brand) => {
    handleBrandSelected(brand);
  };

  onMounted(handleMount);
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
  <div class="flex w-full flex-col p-4 text-center">
    <div
      @click="handleClick(brand)"
      class="group mt-4 h-full max-h-[68px] w-full rounded-md border-2 border-[#D0D4DB] px-4 transition-all duration-75 hover:border-[#0017FC]"
      v-if="brands?.data"
      v-for="brand in brands.data"
      :key="brand.id">
      <p class="h-full w-full p-4 text-[14px] font-normal">{{ brand.name }}</p>
    </div>
  </div>
</template>
