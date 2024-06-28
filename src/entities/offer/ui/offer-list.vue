<script setup lang="ts">
  import { type Offer } from '@/shared/api/generated/Api';
  import { cn } from '@/shared/lib';
  import { Button } from '@/shared/ui/button';
  import { useUnit } from 'effector-vue/composition';
  import { Trash } from 'lucide-vue-next';
  import { useRoute } from 'vue-router';
  import { deleteOfferClicked, offerClicked } from '../model/offers-model';

  defineProps<{
    offersItems: Offer[];
  }>();

  const emit = defineEmits(['offerClicked']);
  const deleteOffer = useUnit(deleteOfferClicked);
  const handleOfferClicked = useUnit(offerClicked);

  const route = useRoute();
  const handleItemClick = (item: Offer) => {
    if (!item) {
      return;
    }
    handleOfferClicked(item);
  };
</script>

<template>
  <div
    :class="
      cn(
        'mt-4 flex w-full cursor-default flex-col items-start justify-between rounded-lg border border-[#D0D4DB] bg-white p-4 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10',
        route.query['active-card'] === item.id?.toString() &&
          'border-[#0017FC] bg-[#1778EA] bg-opacity-10',
      )
    "
    v-for="item in offersItems"
    :key="item.id"
    @click="handleItemClick(item)">
    <div class="flex w-full flex-col">
      <div class="flex w-full flex-row items-center justify-between">
        <h3 class="text-[14px] font-medium text-[#101828]">
          {{ item.name }}
        </h3>
        <Button
          size="icon"
          @click.stop="deleteOffer(item.id ?? 1)"
          variant="ghost"
          class="h-[16px] w-[16px]">
          <Trash class="text-gray-700" />
        </Button>
      </div>
      <h3 class="text-[16px] font-bold text-[#101828]">{{ item.price }} ₽</h3>
    </div>
    <div class="flex w-full flex-row justify-between">
      <p class="text-[15px] font-semibold text-black">{{ item.amount }} шт.</p>
      <p class="text-[15px] font-normal text-black">{{ item.vendor }}</p>
      <p class="text-[14px] font-normal text-[#667085]">
        Время доставки:
        {{ item.delivery_time ? item.delivery_time + ' дн.' : 'Не указано' }}
      </p>
    </div>
  </div>
</template>
