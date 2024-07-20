<script lang="ts" setup>
  import type { BidWithName } from '@/entities/requests';
  import type { OrderWithHistory } from '@/shared/api/generated/Api';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useUnit } from 'effector-vue/composition';
  import { historyQuery } from '../model/history-model';
  import { requestViewModeChanged } from '../model/view-mode';
  import OrderHistory from './order-history.vue';
  import RequestItem from './request-item.vue';

  const changeViewMode = useUnit(requestViewModeChanged);
  const { data: history, pending } = useUnit(historyQuery);
  const status = [
    { color: '#FF9900', text: 'Создана' },
    { color: '#36E000', text: 'Опубликована' },
    { color: '#0017FC', text: 'Исполнена' },
    { color: '#FE2400', text: 'Архивирована' },
  ];

  type IHistory = { orders: OrderWithHistory[] };
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
        <OrderHistory
          hideHistory
          :item="item as OrderWithHistory"
          v-for="item in (history?.history as unknown as IHistory)?.orders" />
        <RequestItem
          show-date
          :item="history as BidWithName"
          :status="status" />
      </div>
    </ScrollArea>
  </div>
</template>
