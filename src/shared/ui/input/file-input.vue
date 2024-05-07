<script lang="ts" setup>
  import Camera from './assets/camera.vue';
  import { ref } from 'vue';

  const input = ref();

  const files = defineModel<FileList>('value', {
    required: true,
  });

  function onFileChange(event: any) {
    if (
      event.target.files?.length &&
      (Array.from(event.target.files).reduce(
        (acc, el: any) => acc + el.size,
        0,
      ) as number) <=
        15 * 1024 * 1024
    ) {
      if (
        event.target.files.length + (files.value ? files.value.length : 0) >
        15
      ) {
        return;
      }

      const dt = new DataTransfer();

      if (files.value) {
        [...Array.from(files.value), ...Array.from(event.target.files)].forEach(
          (file: any) => {
            dt.items.add(file);
          },
        );
      } else {
        [...Array.from(event.target.files)].forEach((file: any) => {
          dt.items.add(file);
        });
      }

      files.value = dt.files;
    }
  }
</script>

<template>
  <input
    @change="onFileChange"
    type="file"
    ref="input"
    class="hidden"
    accept="image/png, image/jpg, image/jpeg, .pdf"
    multiple />
  <div
    @click="input.click()"
    class="group flex w-full cursor-pointer items-center justify-center gap-x-3 rounded-xl border border-dashed border-input py-[15px]">
    <Camera />
    <h1 class="text-input transition-all duration-100 group-hover:text-white">
      Добавить фото
    </h1>
  </div>
</template>
