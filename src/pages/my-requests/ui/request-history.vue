<script lang="ts" setup>
  import type { BidWithName } from '@/entities/requests';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useUnit } from 'effector-vue/composition';
  import { $fullHistory } from '../model/history-model';
  import { requestViewModeChanged } from '../model/view-mode';
  import RequestItem from './request-item.vue';
  import HistoryOrderItem from '@/pages/my-requests/ui/history-order-item.vue';
  import HistoryReturnItem from '@/pages/my-requests/ui/history-return-item.vue';

  const changeViewMode = useUnit(requestViewModeChanged);

  const fullHistory = useUnit($fullHistory);

  const status = [
    { color: '#FF9900', text: 'Создана' },
    { color: '#36E000', text: 'Опубликована' },
    { color: '#0017FC', text: 'Исполнена' },
    { color: '#FE2400', text: 'Архивирована' },
  ];
</script>

<template>
  <div class="flex h-[100vh] flex-col gap-y-4">
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
        <HistoryReturnItem
          :item="fullHistory.return"
          :statusHistory="statusHistory"
          v-if="fullHistory.return"
          v-for="statusHistory in fullHistory.orderReturnHistory" />
        <HistoryOrderItem
          show-date
          :item="fullHistory.order"
          v-if="fullHistory.order"
          :status-history="statusHistory"
          v-for="statusHistory in fullHistory.orderHistory" />
        <RequestItem
          show-date
          v-if="fullHistory.request"
          :statusHistory="statusHistory"
          v-for="statusHistory in fullHistory.requestHistory"
          :item="fullHistory.request as BidWithName"
          :status="status" />
      </div>
    </ScrollArea>
  </div>
</template>
