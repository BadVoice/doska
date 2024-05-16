<script lang="ts" setup>
  import { ChevronLeft, Plus, SlidersHorizontal } from 'lucide-vue-next';
  import { Button } from '@/shared/ui';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useUnit } from 'effector-vue/composition';
  import { requestHistoryHidden } from '../model/my-requests-model';
  import { offerAddButtonClicked } from '@/widgets/offers';

  const handleBack = useUnit(requestHistoryHidden);
  const handleAddManuallyClick = useUnit(offerAddButtonClicked);
</script>

<template>
  <div class="flex min-h-screen flex-col gap-y-4">
    <div
      class="flex items-center justify-between border-b border-[#D0D4DB] px-5 py-3">
      <div class="flex cursor-pointer items-center gap-x-2">
        <ChevronLeft class="h-7 w-7" color="#0017FC" @click="handleBack()" />
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
          v-for="_ in 5">
          <div class="flex w-full flex-col">
            <div class="flex w-full flex-row items-center justify-between">
              <h3 class="text-[14px] font-medium text-[#101828]">
                Дверь Toyota Camry 2012-2017 50
              </h3>
              <Button size="icon" variant="ghost" class="h-[24px] w-[24px]">
                <span
                  class="-mt-4 cursor-pointer select-none text-3xl leading-[0px] text-[#858FA3] transition-all duration-75 hover:text-[#0017FC]"
                  >...</span
                >
              </Button>
            </div>
            <h3 class="text-[16px] font-bold text-[#101828]">10 500Р</h3>
          </div>
          <div class="flex w-full flex-row justify-between">
            <p class="text-[14px] font-normal text-[#667085]">
              2360-2910210, Toyota
            </p>
            <p class="text-[14px] font-normal text-[#667085]">Москва, 9 дней</p>
            <p class="text-[14px] font-normal text-[#667085]">ТехноСтройСнаб</p>
            <p class="text-[14px] font-normal text-[#101828]">1 шт</p>
          </div>

          <!--        <div v-if="item?.photo" class="flex flex-row gap-x-2">-->
          <!--          <img :src="item?.photo" alt="Photo" class="h-[48px] w-[48px]" />-->
          <!--        </div>-->
          <div class="flex items-center gap-x-1">
            <span class="mt-0.5 h-2 w-[9px] rounded-full bg-green-500" />
            <p class="text-[15px] text-green-500">Куплено</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
