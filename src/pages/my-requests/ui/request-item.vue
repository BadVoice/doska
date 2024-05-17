<script lang="ts" setup>
  import { ref } from 'vue';
  import { cn } from '@/shared/lib';
  import { Button, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
  import { PopoverClose } from 'radix-vue';
  import {
    deleteRequestClicked, requestClicked,
    requestHistoryClicked, showSelectBrandClicked,
  } from '@/pages/my-requests/model/my-requests-model';
  import { useUnit } from 'effector-vue/composition';

  export interface Bid {
    id?: string;
    /**
     * @format date-time
     * @example "2024-04-14T08:12:44.533679Z"
     */
    created_at?: string;
    /** @format binary */
    image?: File | null;
    /**
     * dictionary:
     *   * 0 Создана
     *   * 1 Опубликована
     *   * 2 Исполнена
     *   * 3 Архивирована
     * @default 0
     */
    status?: 0 | 1 | 2 | 3;
    name: string;
    article?: string;
    amount: number;
    delivery_time?: number;
    description?: string;
    /** company_id */
    company?: number;
    /** category_id */
    category: number;
    /** brand_id */
    brand?: number;
    brandName?: string;
    categoryName?: string;
    /** destination_id */
    destinations?: number[];
  }

  defineProps<{
    status: { color: string; text: string }[];
    item: Bid;
  }>();

  function renderFile(file: File) {
    return URL.createObjectURL(file);
  }

  const handleHistoryClick = useUnit(requestHistoryClicked);
  const handleSelectBrand = useUnit(showSelectBrandClicked);

  const popoverOpened = ref(false);

  const handleClick = (item: Bid) => {
    console.log('Card data:', item);
    requestClicked(item);
    if(!item.brandName || item.brandName === 'Не указано') {
      handleSelectBrand();
    }

  };
</script>

<template>
  <div
    class="group flex w-full flex-col gap-y-2 rounded-md border-2 border-[#D0D4DB] px-4 py-3 transition-all duration-75 hover:border-[#0017FC]">
    <div class="flex flex-col">
      <div class="flex w-full justify-between">
        <p class="text-sm font-normal text-[#101828]">{{ item.name }}</p>
        <Popover @update:open="(value) => (popoverOpened = value)">
          <PopoverTrigger @click.stop>
            <span
              :class="
                cn(
                  'cursor-pointer select-none text-3xl leading-[0px] text-[#858FA3] transition-all duration-75 hover:text-[#0017FC]',
                  popoverOpened && 'text-[#0017FC]',
                )
              "
            >...</span
            >
          </PopoverTrigger>
          <PopoverContent
            class="flex h-[111px] w-[150px] flex-col justify-center rounded-[10px] border-b-0 border-t-0 p-0">
            <PopoverClose class="flex flex-col gap-y-0">
              <Button
                @click="handleHistoryClick"
                variant="ghost"
                class="rounded-b-0 flex h-full w-full rounded-[8px] border-t-2 border-[#D0D4DB] px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">История заявки</p>
              </Button>
              <Button
                variant="ghost"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Редактировать</p>
              </Button>
              <Button
                variant="ghost"
                @click="deleteRequestClicked(item.id ?? '')"
                class="rounded-t-0 flex h-full w-full rounded-[8px] border-b-2 border-[#D0D4DB] px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Удалить заявку</p>
              </Button>
            </PopoverClose>
          </PopoverContent>
        </Popover>
      </div>
      <div @click="handleClick(item)" class="flex w-full flex-col items-start justify-between gap-y-1">
        <div class="flex flex-row justify-between w-full">
          <div class="flex w-full flex-row gap-x-2">
            <p class="text-xs font-normal text-[#858FA3]" v-if="item.article">{{ item.article }}</p>
            <p class="text-xs font-normal text-[#858FA3]" v-else>Не указано</p>
            <p class="text-xs font-normal text-[#858FA3]" v-if="item.brandName">{{ item.brandName }}</p>
          </div>
          <div class="flex gap-x-1">
            <p class="text-xs font-normal text-[#101828]" v-if="item.amount">{{ item.amount }}</p>
            <p class="text-xs font-normal text-[#101828]" v-else>Не указано</p>
            <p class="text-xs font-normal text-[#101828]" v-if="item.amount">шт</p>
          </div>
        </div>

        <div class="flex flex-row gap-x-2">
          <div>
            <p class="text-xs font-normal text-[#858FA3] min-w-[50px]" v-if="item.categoryName">{{ item.categoryName }}</p>
          </div>
          <div>
            <p class="text-xs font-normal text-[#858FA3]" v-if="item.company">{{ item.company }}</p>
            <p class="text-xs font-normal text-[#858FA3]" v-else>Не указано</p>
          </div>
        </div>
      </div>

    </div>

    <div class="flex gap-x-2" v-if="item.image">
      <img
        :src="renderFile(item.image)"
        alt="attachment"
        class="h-10 w-10 object-cover" />
    </div>
    <div class="flex items-center gap-x-1">
      <span
        :style="{ backgroundColor: status[item.status ?? 0].color }"
        class="mt-0.5 h-2 w-[9px] rounded-full" />
      <p class="text-sm" :style="{ color: status[item.status ?? 0].color }">
        {{ status[item.status ?? 0].text }}
      </p>
    </div>
  </div>
</template>
