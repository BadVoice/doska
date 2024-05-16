<script lang="ts" setup>
  import { ref } from 'vue';
  import type { Bid } from '@/shared/api/generated/Api';
  import { cn } from '@/shared/lib';
  import { Button, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
  import { PopoverClose } from 'radix-vue';
  import {
    deleteRequestClicked,
    requestHistoryClicked,
  } from '@/pages/my-requests/model/my-requests-model';
  import { useUnit } from 'effector-vue/composition';

  defineProps<{
    status: { color: string; text: string }[];
    item: Bid;
  }>();

  function renderFile(file: File) {
    return URL.createObjectURL(file);
  }

  const handleHistoryClick = useUnit(requestHistoryClicked);

  const popoverOpened = ref(false);
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
      <div class="flex w-full items-center justify-between">
        <p class="text-xs font-normal text-[#858FA3]">{{ item.brand }}</p>
        <p class="text-xs font-normal text-[#101828]">{{ item.amount }} шт</p>
      </div>
      <p class="text-xs font-normal text-[#858FA3]">{{ item.company }}</p>
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
