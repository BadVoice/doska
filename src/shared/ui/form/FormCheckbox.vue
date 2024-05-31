<script lang="ts" setup>
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '.';
  import { Checkbox } from '../checkbox';

  defineProps<{
    name: string;
    label: string;
  }>();
</script>

<template>
  <FormField v-slot="{ value, handleChange }" type="checkbox" :name="name">
    <FormItem class="flex flex-row items-start gap-x-3 space-y-0">
      <FormControl>
        <Checkbox :checked="value" @update:checked="handleChange" />
        <FormLabel>{{ label }}</FormLabel>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
