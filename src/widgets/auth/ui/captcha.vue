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

  const emit = defineEmits(['submitCode']);
  const onSubmit = () => {
    emit('submitCode');
  };

</script>

<template v-else>
  <form
    @submit="onSubmit"
    class="flex w-full flex-col gap-y-4 px-5 mt-4">
    <p class="text-[18px] font-semibold">Введите код с картинки</p>
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Телефон или почта</FormLabel>
        <FormControl>
          <Input
            class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
            type="text"
            placeholder="Телефон или почта"
            v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
</template>

<style scoped lang="postcss">

</style>