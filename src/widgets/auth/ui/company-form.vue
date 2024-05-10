<script setup lang="ts">
  import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
  } from '@/shared/ui';
  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
  } from '@headlessui/vue';
  import { ref } from 'vue';

  const emit = defineEmits(['registerCompany', 'skipRegisterCompany']);
  const onSubmit = () => {
    emit('registerCompany', 'skipRegisterCompany');
  };

  const categories = ref([
    {
      cityId: 1,
      transport: 'dsgsdg',
      category:  "111"
    },
    {
      cityId: 2,
      transport: 'dsgsdg',
      category:  "3222"
    },
    {
      cityId: 3,
      transport: 'dsgsdg',
      category:  "dsg"
    }
  ]);

</script>

<template v-else>
 <div class="flex flex-col justify-between h-full ">
  <div class="custom-scrollbar  overflow-x-auto max-h-[calc(100vh-200px)]">
    <form
      @submit="onSubmit"
      class="flex w-full flex-col gap-y-4 px-5 mt-4 ">
      <p class="text-[18px] font-semibold">Регистрация компании</p>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Правовая форма</FormLabel>
          <FormControl>
            <Input
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Правовая форма"
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Наименования</FormLabel>
          <FormControl>
            <Input
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Наименования"
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Категория</FormLabel>
          <FormControl>
            <Input
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Категория"
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Категория</FormLabel>
          <FormControl>
            <Input
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Категория"
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Категория</FormLabel>
          <FormControl>
            <Input
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Категория"
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="relative inline-block text-left">
        <Listbox v-model="categories" multiple>
          <p class="py-2 text-[13px] font-semibold text-[#101828]">
            Населенный пункт
          </p>
          <ListboxButton
            class="inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
            <p class="text-sm font-normal text-gray-400">Населенный пункт</p>
          </ListboxButton>

          <transition
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <ListboxOptions
              class="absolute z-10 mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                v-for="item in categories"
                :key="item.cityId"
                :value="item"
                as="template">
                <li
                  class="mx-1 my-1 cursor-pointer select-none rounded bg-blue-200 py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-100"
                  :class="{
                      'bg-gray-50 text-black ': categories.some(
                        (city) => city.cityId === item.cityId,
                      ),
                    }">
                    <span class="block truncate font-normal">
                      {{ item.transport }}</span
                    >
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>
      </div>

   </form>
 </div>
   <div class="inset-x-0 bottom-0 border-t border-[#CCD0D9] bg-white p-4 w-full gap-y-2 flex flex-col">
     <Button @click="$emit( 'registerCompany')" class="w-full text-[17px] font-semibold">Войти</Button>
     <Button @click="$emit('skipRegisterCompany')" class="w-full text-[17px] font-semibold bg-whhite border border-[#0017FC] text-[#0017FC] hover:bg-white">Пропустить этот шаг</Button>
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