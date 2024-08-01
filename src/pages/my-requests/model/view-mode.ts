import { createBidVisibilityChanged } from '@/features/create-advertisement';
import { handleShowAuthChanged } from '@/widgets/auth';
import { searchVisibilityChanged } from '@/widgets/header';
import { createEvent, createStore, sample } from 'effector';
import { reset } from 'patronum';
import { $fullHistory } from './history-model';

type TSelectScreenMode = 'offers' | 'selectBrand' | 'history' | 'search' | null;

export const resetRequestViewMode = createEvent();
export const requestViewModeChanged = createEvent<TSelectScreenMode>();

export const $requestViewMode = createStore<TSelectScreenMode | null>(null).on(
  requestViewModeChanged,
  (_, clk) => clk,
);

reset({
  clock: [
    resetRequestViewMode,
    handleShowAuthChanged,
    searchVisibilityChanged,
    createBidVisibilityChanged,
  ],
  target: $requestViewMode,
});

sample({
  clock: $fullHistory,
  fn: () => 'history' as const,
  target: $requestViewMode,
});
