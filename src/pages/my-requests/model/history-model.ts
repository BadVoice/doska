import { $requestViewMode } from '@/pages/my-requests/model/my-requests-model';
import { $api } from '@/shared/api';
import { toast } from '@/shared/ui/toast';
import { createQuery } from '@farfetched/core';
import { createEffect, createEvent, sample } from 'effector';
import type { BidWithName } from './my-requests-model';

export const historyClicked = createEvent<BidWithName>();

export const historyQuery = createQuery({
  handler: async (item: BidWithName) =>
    (await $api.bids.getBid(item?.id ?? 0)).data.history,
});

sample({
  clock: historyClicked,
  filter: (clk) => clk.status === 2,
  fn: () => 'history' as const,
  target: $requestViewMode,
});

sample({
  clock: historyClicked,
  filter: (clk) => clk.status === 2,
  target: historyQuery.start,
});

const notifyAboutStatusFx = createEffect(() => {
  toast({
    title: 'История есть только у заявок в статусе "Исполнена"',
    variant: 'destructive',
  });
});

sample({
  clock: historyClicked,
  filter: (clk) => clk.status !== 2,
  target: notifyAboutStatusFx,
});
