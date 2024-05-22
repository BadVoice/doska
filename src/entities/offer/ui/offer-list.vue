<script setup lang="ts">
  import type { Item } from '@/shared/api/generated/Api';
  import { Button } from '@/shared/ui/button';
  import { cn } from '@/shared/lib';
  import { useRoute } from 'vue-router';

  defineProps<{
    offersItems: Item[];
  }>();

  const emit = defineEmits(['offerClicked']);

  const route = useRoute();
  const handleItemClick = (item: Item) => {
    if (!item) {
      return;
    }
    emit('offerClicked', item);
  };
</script>

<template>
  <div
    :class="
      cn(
        'mb-4 flex w-full cursor-default flex-col items-start justify-between rounded-lg border border-[#D0D4DB] bg-white p-4 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10',
        route.query['active-card'] === item.itemId &&
          'border-[#0017FC] bg-[#1778EA] bg-opacity-10',
      )
    "
    v-for="item in offersItems"
    :key="item.itemId"
    @click="handleItemClick(item)">
    <div class="flex w-full flex-col">
      <div class="flex w-full flex-row items-center justify-between">
        <h3 class="text-[14px] font-medium text-[#101828]">{{ item.title }}</h3>
        <Button size="icon" variant="ghost" class="h-[24px] w-[24px]">
          <img src="../assets/extensionIcon.svg" alt="extensionIcon" />
        </Button>
      </div>
      <h3
        v-if="item.price"
        :key="item.price.formatted"
        class="text-[16px] font-bold text-[#101828]">
        {{ item.price.formatted }}
      </h3>
    </div>
    <div class="flex w-full flex-row justify-between">
      <p class="text-[14px] font-normal text-[#667085]">
        {{ item.article ? `${item.article}, ${item.brand}` : 'Не указано' }}
      </p>
      <p class="text-[14px] font-normal text-[#667085]">
        {{
          item.warehouse && item.parsedDelivery
            ? `${item.warehouse}, ${item.parsedDelivery} дн.`
            : 'Не указано'
        }}
      </p>
      <p class="text-[14px] font-normal text-[#667085]">
        {{ item.vendorTitle ? item.vendorTitle : 'Не указано' }}
      </p>
      <p class="text-[14px] font-normal text-[#101828]">
        {{
          item.quantity && item.quantity.formatted
            ? item.quantity.formatted
            : 'Не указано'
        }}
      </p>
    </div>

    <div v-if="item?.photo" class="flex flex-row gap-x-2">
      <img :src="item?.photo" alt="Photo" class="h-[48px] w-[48px]" />
    </div>
  </div>
</template>
