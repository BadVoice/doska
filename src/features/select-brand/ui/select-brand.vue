<script setup lang="ts">
  import { useUnit } from 'effector-vue/composition';
  import { getBrands, mounted } from '../model/brand-model';
  import { onMounted } from 'vue';
  import {
    brandClickedOnChange,
    requestViewModeChanged
  } from "@/pages/my-requests/model/my-requests-model";

  const handleMount = useUnit(mounted);
  const { data: brands } = useUnit(getBrands);
  const changeViewMode = useUnit(requestViewModeChanged);

  const handleClick = (brand: any ) => {
    brandClickedOnChange(brand);
  };

  onMounted(handleMount);
</script>

<template>
  <div class="w-full h-[56px] font-semibold text-[18px] cursor-default flex items-start border-b border-[#D0D4DB] p-4 gap-x-2">
    <img
        class="h-7 w-7 cursor-pointer"
        src="../ui/assets/backIcon.svg "
        alt="Back"
        @click="changeViewMode(null)" />
    <p>Выбор бренда по заявке</p>
  </div>
 <div class="mx-4">
   <div
       @click="handleClick(brand)"
       class="w-full h-full max-h-[68px] rounded-md border-2 group border-[#D0D4DB] px-4 transition-all duration-75 hover:border-[#0017FC] mt-4"
       v-if="brands?.data" v-for="brand in brands.data" :key="brand.id">
     <p class="w-full h-full p-4 text-[14px] font-normal">{{ brand.name }}</p>
   </div>
 </div>
</template>
