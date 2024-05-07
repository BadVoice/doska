<script lang="ts" setup>
  import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/shared/ui/form';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/shared/ui/select';

  withDefaults(
    defineProps<{
      values: any;
      label: string;
      name: string;
      placeholder: string;
      cityMode?: boolean;
    }>(),
    {
      cityMode: false,
    },
  );
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel class="text-[13px] font-semibold text-[#101828]" v-if="label">
        {{ label }}
      </FormLabel>

      <Select v-bind="componentField">
        <FormControl>
          <SelectTrigger>
            <SelectValue :placeholder="placeholder" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="item of values"
              :value="cityMode ? item.id : item">
              {{ cityMode ? item.title : item }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
