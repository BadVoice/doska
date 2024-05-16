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
      <FormLabel class="text-[13px] font-semibold" v-if="label">
        {{ label }}
      </FormLabel>

      <FormControl>
        <Input
          :type="number ? 'number' : 'text'"
          :placeholder="placeholder"
          v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
