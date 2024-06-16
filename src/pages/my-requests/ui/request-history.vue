<script lang="ts" setup>
  import { requestViewModeChanged } from '@/pages/my-requests/model/my-requests-model';
  import { Button } from '@/shared/ui';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { offerAddButtonClicked } from '@/widgets/offers';
  import { useUnit } from 'effector-vue/composition';
  import { Plus, SlidersHorizontal } from 'lucide-vue-next';
  import { historyQuery } from '../model/history-model';

  const changeViewMode = useUnit(requestViewModeChanged);
  const handleAddManuallyClick = useUnit(offerAddButtonClicked);
  const { data: history } = useUnit(historyQuery);
</script>

<template>
  <div class="flex min-h-screen flex-col gap-y-4">
    <div
      class="flex items-center justify-between border-b border-[#D0D4DB] px-5 py-3">
      <div class="flex cursor-pointer items-center gap-x-2">
        <img
          class="h-7 w-7"
          src="../ui/assets/backIcon.svg "
          alt="Back"
          @click="changeViewMode(null)" />
        <p class="text-[17px] font-semibold">История заявки</p>
      </div>
      <div class="flex items-center gap-x-2">
        <SlidersHorizontal color="#0017FC" class="h-5 w-5 cursor-pointer" />
        <Button variant="ghost" @click="handleAddManuallyClick()" size="icon">
          <Plus color="#0017FC" />
        </Button>
      </div>
    </div>
    <ScrollArea class="mx-4 h-[90vh] pb-5">
      <div class="mb-5 flex flex-col gap-y-4">
        <div
          class="flex w-full cursor-default flex-col items-start justify-between gap-y-1 rounded-lg border border-[#D0D4DB] bg-white p-4 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10"
          v-for="item in history">
          <div class="flex w-full flex-col">
            <div class="flex w-full flex-row items-center justify-between">
              <h3 class="text-[14px] font-medium text-[#101828]">
                {{ item.name }}
              </h3>
              <Button size="icon" variant="ghost" class="h-[24px] w-[24px]">
                <span
                  class="-mt-4 cursor-pointer select-none text-3xl leading-[0px] text-[#858FA3] transition-all duration-75 hover:text-[#0017FC]"
                  >...</span
                >
              </Button>
            </div>
            <h3 class="text-[16px] font-bold text-[#101828]">
              {{ item.price }}
            </h3>
          </div>
          <div class="flex w-full flex-row justify-between">
            <p class="text-[14px] font-normal text-[#667085]">
              {{ item.company }}
            </p>
            <p class="text-[14px] font-normal text-[#667085]">
              {{ item.delivery_time }}
            </p>
            <!--<p class="text-[14px] font-normal text-[#667085]">{{ item. }}</p>-->
            <p class="text-[14px] font-normal text-[#101828]">
              {{ item.amount }}
            </p>
          </div>

          <!--        <div v-if="item?.photo" class="flex flex-row gap-x-2">-->
          <!--          <img :src="item?.photo" alt="Photo" class="h-[48px] w-[48px]" />-->
          <!--        </div>-->
          <!--<div class="flex items-center gap-x-1">
            <span class="mt-0.5 h-2 w-[9px] rounded-full bg-green-500" />
            <p class="text-[15px] text-green-500">{{ item. }}</p>
          </div>-->
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
