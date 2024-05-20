<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
  import { cn } from '@/shared/lib';
  import { Button, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
  import { PopoverClose } from 'radix-vue';
  import {
    deleteRequestClicked,
    requestClicked, requestClickedOnChange,
    requestViewModeChanged,
  } from '@/pages/my-requests/model/my-requests-model';
  import { useUnit } from 'effector-vue/composition';
  import type { BidWithName } from '@/entities/requests';
import {useRoute} from "vue-router";

  defineProps<{
    status: { color: string; text: string }[];
    item: BidWithName;
  }>();

  const route = useRoute();

  function renderFile(file: File) {
    return URL.createObjectURL(file);
  }

  const changeViewMode = useUnit(requestViewModeChanged);

  const popoverOpened = ref(false);

  const handleClick = (item: BidWithName) => {
    requestClicked(item);
    changeViewMode('offers');
    // if (!item.brandName || item.brandName === 'Не указано') {
    //   requestClickedOnChange(item);
    //   changeViewMode('selectBrand');
    // } else {
    //   requestClicked(item);
    //   changeViewMode('offers');
    // }
  };
const handleClickOnChange = (item: BidWithName) => {
    requestClickedOnChange(item);
    changeViewMode('selectBrand');

};
</script>

<template>
  <div
      @click="handleClick(item)"
      :class="
            cn(
              'flex flex-col items-start justify-between rounded-lg border-2 gap-y-1 bg-white p-4 pr-5 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10',
              route.query['search'] === item.name &&  route.query['active-pre-search'] === item.brandName &&
                'border-[#0017FC] bg-[#1778EA] bg-opacity-10',
            )
          "
    class=" px-4 py-3 transition-all duration-75 hover:border-[#0017FC]">
    <div class="flex flex-col w-full gap-y-1" >
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
                @click="changeViewMode('history')"
                variant="ghost"
                class="rounded-b-0 flex h-full w-full rounded-[8px] border-t-2 border-[#D0D4DB] px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">История заявки</p>
              </Button>
              <Button
                variant="ghost"
                @click="handleClickOnChange(item)"
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
      <div
        class="flex w-full flex-col items-start justify-between gap-y-1"

      >
        <div class="flex w-full flex-row justify-between">
          <div class="flex w-full flex-row gap-x-2">
            <p class="text-xs font-normal text-[#858FA3]" v-if="item.article">
              {{ item.article }}
            </p>
            <p class="text-xs font-normal text-[#858FA3]" v-else>Не указано</p>
            <p class="text-xs font-normal text-[#858FA3]" v-if="item.brandName">
              {{ item.brandName }}
            </p>
          </div>
          <div class="flex gap-x-1">
            <p class="text-xs font-normal text-[#101828]" v-if="item.amount">
              {{ item.amount }}
            </p>
            <p class="text-xs font-normal text-[#101828]" v-else>Не указано</p>
            <p class="text-xs font-normal text-[#101828]" v-if="item.amount">
              шт
            </p>
          </div>
        </div>

        <div class="flex flex-row gap-x-2">
          <div>
            <p
              class="min-w-[50px] text-xs font-normal text-[#858FA3]"
              v-if="item.categoryName">
              {{ item.categoryName }}
            </p>
          </div>
          <div>
            <p class="text-xs font-normal text-[#858FA3]" v-if="item.company">
              {{ item.company }}
            </p>
            <p class="text-xs font-normal text-[#858FA3]" v-else>Не указано</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-x-2 "  v-if="item.image" >
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
