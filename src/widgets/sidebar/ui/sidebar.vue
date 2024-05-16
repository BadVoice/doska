<script setup lang="ts">
import  companyIcon  from "@/widgets/sidebar/assets/companyIcon.vue";
import  myRequestsIcon  from "@/widgets/sidebar/assets/myRequstsIcon.vue";
import  myOffersIcon  from "@/widgets/sidebar/assets/myOffersIcon.vue";
import  logoutIcon  from "@/widgets/sidebar/assets/logoutIcon.vue";
import {Button} from "@/shared/ui";
import {type DefineComponent, reactive} from "vue";

export interface IButtonMobile {
  label: string;
  action?: () => void;
  icon: DefineComponent<{}, {}, any> | null;
}

const emit = defineEmits(['close-sidebar', 'navigate', 'logout', 'add-company', 'my-requests']);

const  sidebarItems = reactive<IButtonMobile[]>([
      { label: 'Мои Покупки', icon: myRequestsIcon, action: () => emit('navigate', 'my-requests') },
      { label: 'Мои продажи', icon: myOffersIcon, action: () => emit('navigate', 'my-offers') },
      { label: 'Переключить аккаунт', icon: logoutIcon, action: () => emit('navigate', 'logout') },
      { label: 'Добавить компанию', icon: companyIcon , action: () => emit('navigate', 'add-company') },
  ]);


</script>

<template>
<div class="w-full md:max-w-[356px] h-[100vh] border border-r">

  <div class="flex items-center pl-2 p-4  border-b">
    <Button @click="emit('close-sidebar' )" size="icon" variant="ghost" class="max-h-[24px]">
      <img src="../assets/exit.svg" alt="exit" />
    </Button>
    <p  @click="emit('close-sidebar' )" class="text-[15px] text-[#0017FC] cursor-pointer">Закрыть</p>
  </div>

  <ul class="flex flex-col gap-y-2 pl-2 p-4">
    <li v-for="item in sidebarItems" :key="item.label" class="flex items-center">
      <Button @click="item.action" size="icon" variant="ghost">
        <component  v-bind:is="item?.icon" />
      </Button>
      <p @click="item.action" class=" ml-2 text-[16px] font-semibold cursor-pointer">{{ item.label }}</p>
    </li>
  </ul>
</div>
</template>

<style scoped lang="postcss">

</style>