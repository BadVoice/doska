<script setup lang="ts">
  import { $requestViewMode } from '@/pages/my-requests';
  import type { PreSearchResponse } from '@/shared/api/generated/Api';
  import { cn } from '@/shared/lib';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useUnit } from 'effector-vue/composition';
  import { onUnmounted } from 'vue';
  import {
    $selectedAdvertisementId,
    advertisementClicked,
    preSearchUnmounted,
  } from '../model/advertisement-model';

  defineProps<{
    searchResult: Readonly<PreSearchResponse[]>;
  }>();

  const handleSelected = useUnit(advertisementClicked);
  const selectedItem = useUnit($selectedAdvertisementId);
  const requestViewMode = useUnit($requestViewMode);
  const handleUnmounted = useUnit(preSearchUnmounted);

  onUnmounted(handleUnmounted);

  const handleCardClick = (item: PreSearchResponse) => {
    if (!item) return;

    handleSelected({
      id: item.id,
      article: item.article,
      brand: item.brand,
      selectBrand: requestViewMode.value === 'selectBrand',
    });
  };
</script>

<template>
  <div v-if="searchResult" class="broder-r w-full border">
    <ScrollArea
      :class="
        cn(
          'overflow-auto',
          requestViewMode === 'selectBrand'
            ? 'h-[calc(100vh-41px]'
            : 'h-[calc(100vh-190px)',
        )
      ">
      <div
        class="mx-auto flex w-full flex-col items-center justify-center gap-y-6 p-4">
        <DynamicScroller
          class="flex w-full flex-col gap-y-4 max-sm:w-[100vw]"
          :items="searchResult"
          :min-item-size="91">
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :size-dependencies="[item.brand]"
              :data-index="index">
              <div class="py-2">
                <div
                  @click="handleCardClick(item)"
                  :key="item.id"
                  :class="
                    cn(
                      'flex w-full flex-col items-start justify-between rounded-lg border-2 bg-white p-4 pr-5 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10',
                      selectedItem === item.id &&
                        'border-[#0017FC] bg-[#1778EA] bg-opacity-10',
                    )
                  ">
                  <p class="text-[14px]">{{ item?.article }}</p>
                  <div class="flex flex-row gap-x-2">
                    <p class="text-[12px] text-[#858FA3]">
                      {{ item?.part_name }},
                    </p>
                    <p class="text-[12px] text-[#858FA3]">{{ item?.brand }}</p>
                  </div>
                </div>
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </div>
    </ScrollArea>
  </div>
</template>
