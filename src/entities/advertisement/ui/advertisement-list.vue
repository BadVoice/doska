<script setup lang="ts">
  import type { PreSearchResponse } from '@/shared/api/generated/Api';
  import { cn } from '@/shared/lib';
  import { useUnit } from 'effector-vue/composition';
  import {
    $selectedAdvertisementId,
    advertisementClicked,
  } from '../model/advertisement-model';

  defineProps<{
    searchResult: Readonly<PreSearchResponse[]>;
  }>();

  const handleSelected = useUnit(advertisementClicked);
  const selectedItem = useUnit($selectedAdvertisementId);

  const handleCardClick = (item: PreSearchResponse) => {
    if (!item) return;

    handleSelected({ id: item.id, article: item.article, brand: item.brand });
  };
</script>

<template>
  <div v-if="searchResult" class="broder-r w-full border">
    <div class="mx-auto flex flex-col items-center justify-center gap-y-6 p-4">
      <ul class="flex w-full max-w-[324px] flex-col gap-y-4">
        <li
          v-for="item in searchResult"
          @click="handleCardClick(item)"
          :key="item.id"
          :class="
            cn(
              'flex flex-col items-start justify-between rounded-lg border-2 bg-white p-4 pr-5 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10',
              selectedItem === item.id &&
                'border-[#0017FC] bg-[#1778EA] bg-opacity-10',
            )
          ">
          <p class="text-[14px]">{{ item?.article }}</p>
          <div class="flex flex-row gap-x-2">
            <p class="text-[12px] text-[#858FA3]">{{ item?.part_name }},</p>
            <p class="text-[12px] text-[#858FA3]">{{ item?.brand }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
