<script setup lang="ts">
  import { type Offer } from '@/shared/api/generated/Api';
  import { cn } from '@/shared/lib';
  import { useUnit } from 'effector-vue/composition';
  import { useRoute } from 'vue-router';
  import { deleteOfferClicked, offerClicked } from '../model/offers-model';
  import OfferItem from './offer-item.vue';

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
    <OfferItem :item="item" />
  </div>
</template>
