<script setup lang="ts">
  import { Button } from '@/shared/ui';
  import companyIcon from '@/widgets/sidebar/assets/companyIcon.vue';
  import logoutIcon from '@/widgets/sidebar/assets/logoutIcon.vue';
  import myOffersIcon from '@/widgets/sidebar/assets/myOffersIcon.vue';
  import myRequestsIcon from '@/widgets/sidebar/assets/myRequstsIcon.vue';
  import { type DefineComponent } from 'vue';

  export interface IButtonMobile {
    label: string;
    action?: () => void;
    icon: DefineComponent<{}, {}, any> | null;
  }

  const emit = defineEmits<{
    (e: 'close-sidebar'): void;
    (
      e: 'navigate',
      value: 'my-requests' | 'my-offers' | 'change-company' | 'add-company',
    ): void;
  }>();

  const sidebarItems: IButtonMobile[] = [
    {
      label: 'Мои Покупки',
      icon: myRequestsIcon,
      action: () => emit('navigate', 'my-requests'),
    },
    {
      label: 'Мои Продажи',
      icon: myOffersIcon,
      action: () => emit('navigate', 'my-offers'),
    },
    {
      label: 'Переключить компанию',
      icon: logoutIcon,
      action: () => emit('navigate', 'change-company'),
    },
    {
      label: 'Добавить компанию',
      icon: companyIcon,
      action: () => emit('navigate', 'add-company'),
    },
  ];
</script>

<template>
  <div class="h-[100vh] w-full border border-r md:max-w-[356px]">
    <div class="flex items-center border-b p-4 pl-2">
      <Button
        @click="emit('close-sidebar')"
        size="icon"
        variant="ghost"
        class="max-h-[24px]">
        <img src="../assets/exit.svg" alt="exit" />
      </Button>
      <p
        @click="emit('close-sidebar')"
        class="cursor-pointer text-[15px] text-[#0017FC]">
        Закрыть
      </p>
    </div>

    <ul class="flex flex-col gap-y-2 p-4 pl-2">
      <li
        v-for="item in sidebarItems"
        :key="item.label"
        class="flex items-center">
        <Button @click="item.action" size="icon" variant="ghost">
          <component v-bind:is="item?.icon" />
        </Button>
        <p
          @click="item.action"
          class="ml-2 cursor-pointer text-[16px] font-semibold">
          {{ item.label }}
        </p>
      </li>
    </ul>
  </div>
</template>
