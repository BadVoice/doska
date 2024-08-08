<script setup lang="ts">
  import { type Offer } from '@/shared/api/generated/Api';
  import { Button } from '@/shared/ui/button';
  import { useUnit } from 'effector-vue/composition';
  import { Trash } from 'lucide-vue-next';
  import { deleteOfferClicked, getVendors } from '../model/offers-model';

  defineProps<{
    item: Offer;
    showStatusMark?: boolean;
    amount?: number;
  }>();

  const { data: vendors } = useUnit(getVendors);

  const deleteOffer = useUnit(deleteOfferClicked);
</script>

<template>
  <div class="mb-1 flex w-full flex-col">
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
  <div class="mb-1 flex w-full flex-row justify-between">
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

    <p v-if="amount" class="text-[14px] font-normal text-black">
      {{ amount }} шт
    </p>
  </div>
  <div v-if="showStatusMark" class="flex w-full justify-between">
    <div class="flex items-center gap-x-1">
      <span class="mt-px h-2.5 w-2.5 rounded-full bg-[#4760F6]" />
      <p class="text-[14px] font-normal text-[#4760F6]">Предложение</p>
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
</template>
