<script setup lang="ts">
  import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/shared/ui/form';
  import { Input } from '@/shared/ui/input';

  withDefaults(
    defineProps<{
      name: string;
      label?: string;
      placeholder: string;
      number?: boolean;
    }>(),
    { number: false },
  );
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem class="flex flex-col">
      <FormLabel class="text-[13px] font-semibold" v-if="label ?? placeholder">
        {{ label ?? placeholder }}
      </FormLabel>

      <FormControl>
        <Input
          :type="number ? 'number' : 'text'"
          class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
          :placeholder="placeholder"
          v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
