<script setup lang="ts">
  import { type Offer } from '@/shared/api/generated/Api';
  import { Button } from '@/shared/ui/button';
  import { useUnit } from 'effector-vue/composition';
  import { Trash } from 'lucide-vue-next';
  import { deleteOfferClicked, getVendors } from '../model/offers-model';

  defineProps<{
    item: Offer;
  }>();

  const { data: vendors } = useUnit(getVendors);

  const deleteOffer = useUnit(deleteOfferClicked);
</script>

<template>
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
    <p class="text-[14px] font-normal text-[#667085]">
      {{
        item.article && item.raw_brand
          ? `${item.article}, ${item.raw_brand}`
          : item.article
            ? item.article
            : 'Не указано'
      }}
    </p>
    <p class="text-[14px] font-normal text-[#667085]">
      {{ item.delivery_time + 'дн.' }}
    </p>

    <p class="text-[14px] font-normal text-[#667085]">
      {{
        vendors?.data.find((v) => v.id === item.vendor)?.title ?? 'Не указано'
      }}
    </p>
  </div>
</template>
