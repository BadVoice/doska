<script lang="ts" setup>
  import { type Order, type OrderReturn } from '@/shared/api/generated/Api';
  import { cn } from '@/shared/lib';
  import { Button, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
  import { useUnit } from 'effector-vue/composition';
  import { PopoverClose } from 'radix-vue';
  import { ref } from 'vue';
  import { historyClickedReturn } from '../model/history-model';
  import {
    cancelReturnClicked,
    confirmReturnClicked,
  } from '../model/order-model';

  defineProps<{
    item: OrderReturn & Order & { brand: string };
    hideHistory?: boolean;
  }>();

  const cancelReturn = useUnit(cancelReturnClicked);
  const confirmReturn = useUnit(confirmReturnClicked);
  const showHistory = useUnit(historyClickedReturn);

  const popoverOpened = ref(false);

  const StatusDictionary = Object.freeze({
    0: { label: 'Возврат', color: '#FFC50F' },
    1: { label: 'Возвращено', color: '#FF570F' },
  });
</script>

<template>
  <div
    class="flex flex-col items-start justify-between gap-y-1 rounded-lg border-2 bg-white p-4 pr-5 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10">
    <div class="flex w-full flex-col gap-y-1">
      <div class="flex w-full justify-between">
        <p class="text-sm font-normal text-[#101828]">
          {{ item.name }}
        </p>
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
                @click="cancelReturn(item)"
                variant="ghost"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Отменить</p>
              </Button>
              <Button
                v-if="item.status === 0"
                variant="ghost"
                @click="confirmReturn(item)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Возвращено</p>
              </Button>
              <Button
                v-if="!hideHistory"
                variant="ghost"
                @click="showHistory(item)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">История</p>
              </Button>
            </PopoverClose>
          </PopoverContent>
        </Popover>
      </div>
      <div class="flex w-full flex-col items-start justify-between gap-y-1">
        <div class="flex w-full flex-row justify-between">
          <div class="mt-1 flex w-full justify-between gap-x-2 pr-4">
            <p class="text-xs font-normal text-[#858FA3]">
              {{ item.amount }} шт
            </p>
            <p class="text-xs font-normal text-[#858FA3]">{{ item.price }} ₽</p>
            <p class="text-xs font-normal text-[#858FA3]">{{ item.city }}</p>
          </div>
        </div>
        <p class="text-xs font-normal text-[#858FA3]">{{ item.brand }}</p>
        <div class="flex w-full justify-between">
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
          <p class="text-[14px] font-normal text-[#667085]">
            {{
              new Date(Date.parse(item.created_at!))
                .toLocaleString('ru-RU', {
                  timeStyle: 'short',
                  dateStyle: 'short',
                })
                .split(', ')
                .reverse()
                .join(' ')
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
