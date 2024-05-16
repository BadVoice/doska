<script setup lang="ts">
  import { Button } from '@/shared/ui';

  import { ref } from 'vue';
  import { useUnit } from 'effector-vue/composition';
  import { formSubmitted } from '@/widgets/auth/model/auth-model';
  import { CreateCompany } from '@/features/create-company';

  const emit = defineEmits(['registerCompany', 'skipRegisterCompany']);
  const onSubmit = () => {
    emit('registerCompany', 'skipRegisterCompany');
  };

  const categories = ref([
    {
      cityId: 1,
      transport: 'dsgsdg',
      category: '111',
    },
    {
      cityId: 2,
      transport: 'dsgsdg',
      category: '3222',
    },
    {
      cityId: 3,
      transport: 'dsgsdg',
      category: 'dsg',
    },
  ]);

  const nextModal = useUnit(formSubmitted);
</script>

<template v-else>
  <div class="flex h-full flex-col justify-between">
    <div class="custom-scrollbar max-h-[calc(100vh-200px)] overflow-x-auto">
      <CreateCompany />
    </div>
    <div
      class="inset-x-0 bottom-0 flex w-full flex-col gap-y-2 border-t border-[#CCD0D9] bg-white p-4">
      <Button
        @click="$emit('registerCompany')"
        class="w-full text-[17px] font-semibold"
        >Войти</Button
      >
      <Button
        @click="nextModal()"
        class="bg-whhite w-full border border-[#0017FC] text-[17px] font-semibold text-[#0017FC] hover:bg-white"
        >Пропустить этот шаг</Button
      >
    </div>
  </div>
</template>

<style scoped lang="postcss">
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #d0d4db #f9fafb;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    background-color: #f9fafb;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d0d4db;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #a7acb5;
  }
</style>
