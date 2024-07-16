<script lang="ts" setup>
  import { type Offer, type Order } from '@/shared/api/generated/Api';
  import { cn } from '@/shared/lib';
  import { Button, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
  import { useUnit } from 'effector-vue/composition';
  import { PopoverClose } from 'radix-vue';
  import { ref } from 'vue';
  import { historyClicked } from '../model/history-model';
  import {
    cancelOrderClicked,
    confirmOrderClicked,
    returnOrderClicked,
  } from '../model/order-model';

  const props = defineProps<{
    item: Order & Offer;
    hideHistory?: boolean;
  }>();

  const showHistory = useUnit(historyClicked);
  const confirmOrder = useUnit(confirmOrderClicked);
  const cancelOrder = useUnit(cancelOrderClicked);
  const returnOrder = useUnit(returnOrderClicked);

  const popoverOpened = ref(false);

  const StatusDictionary = Object.freeze({
    0: { label: 'Заказано', color: '#40CCBA' },
    1: { label: 'Исполнено', color: '#0017FC' },
  });
</script>

<template>
  <div
    class="flex flex-col items-start justify-between gap-y-1 rounded-lg border-2 bg-white p-4 pr-5 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10">
    <div class="flex w-full flex-col gap-y-1">
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
            class="flex h-fit w-[150px] flex-col justify-center overflow-hidden rounded-[10px] p-0">
            <PopoverClose class="flex flex-col gap-y-0">
              <Button
                v-if="!hideHistory"
                @click="showHistory(item)"
                variant="ghost"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">История</p>
              </Button>
              <Button
                v-if="item.status === 1"
                variant="ghost"
                @click="returnOrder(item)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Вернуть</p>
              </Button>
              <Button
                v-if="item.status === 0"
                variant="ghost"
                @click="confirmOrder(item)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Исполнить</p>
              </Button>
              <Button
                variant="ghost"
                @click="cancelOrder(item)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Отменить</p>
              </Button>
            </PopoverClose>
          </PopoverContent>
        </Popover>
      </div>
      <div class="flex w-full flex-col items-start justify-between gap-y-1">
        <div class="flex w-full flex-row justify-between">
          <div class="jsustify-between flex w-full gap-x-2 pr-4">
            <p class="text-xs font-normal text-[#858FA3]">
              {{ item.amount }} шт
            </p>

            <p class="text-xs font-normal text-[#858FA3]">{{ item.price }} ₽</p>
            <p class="text-xs font-normal text-[#858FA3]">{{ item.city }}</p>
            <p class="text-xs font-normal text-[#858FA3]">
              {{ item.raw_brand }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-x-1">
          <span
            class="mt-px h-2.5 w-2.5 rounded-full"
            :style="{
              backgroundColor: StatusDictionary[item.status as 0 | 1].color,
            }" />
          <p
            class="text-[14px] font-normal"
            :style="{
              color: StatusDictionary[item.status as 0 | 1].color,
            }">
            {{ StatusDictionary[item.status as 0 | 1].label }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
