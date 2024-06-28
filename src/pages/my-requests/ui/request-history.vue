<script lang="ts" setup>
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useUnit } from 'effector-vue/composition';
  import { historyQuery } from '../model/history-model';
  import { requestViewModeChanged } from '../model/view-mode';

  const changeViewMode = useUnit(requestViewModeChanged);
  const { data: history, pending } = useUnit(historyQuery);
</script>

<template>
  <div class="flex h-[100vh] flex-col gap-y-4" v-if="!pending">
    <div
      class="flex items-center justify-between border-b border-[#D0D4DB] px-5 py-3">
      <div class="flex cursor-pointer items-center gap-x-2">
        <img
          class="h-7 w-7"
          src="../ui/assets/backIcon.svg "
          alt="Back"
          @click="changeViewMode(null)" />
        <p class="text-[17px] font-semibold">История</p>
      </div>
    </div>
    <ScrollArea class="h-[calc(100vh-41px)] px-4">
      <div class="mb-5 flex flex-col gap-y-4">
        <div
          class="flex w-full cursor-default flex-col items-start justify-between gap-y-1 rounded-lg border border-[#D0D4DB] bg-white p-4 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10"
          v-for="item in history?.orders">
          <div class="flex w-full flex-col">
            <div class="flex w-full flex-row items-center justify-between">
              <div class="flex gap-x-2">
                <h3 class="text-[14px] font-medium text-[#101828]">Заказ:</h3>
                <h3 class="text-[14px] font-medium text-[#101828]">
                  {{ item.name }}
                </h3>
              </div>
            </div>
            <h3 class="text-[16px] font-bold text-[#101828]">
              {{ item.price }} ₽
            </h3>
          </div>
          <div class="flex w-full flex-row flex-wrap justify-between">
            <p class="text-[14px] font-normal text-[#101828]">
              Количество: {{ item.amount }}
            </p>
            <p class="text-[14px] font-normal text-[#667085]">
              {{ item.company }}
            </p>
            <p class="text-[14px] font-normal text-[#667085]">
              {{ item.delivery_time }}
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
