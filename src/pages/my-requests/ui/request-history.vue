<script lang="ts" setup>
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useUnit } from 'effector-vue/composition';
  import { historyQuery } from '../model/history-model';
  import { requestViewModeChanged } from '../model/view-mode';
  import OrderItem from './order-item.vue';

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
        <OrderItem hideHistory :item="item" v-for="item in history?.orders" />
      </div>
    </ScrollArea>
  </div>
</template>
