import { computed, type Ref } from 'vue';

export function getButtonList(visibleSearch: Ref<boolean>) {
  return computed(() => {
    if (visibleSearch.value) {
      return [
        {
          label: 'Объявления',
          link: '/advertisements',
          active: false,
          status: -1,
        },
        {
          label: 'Мои Заявки',
          link: '/',
          active: false,
          status: -2,
        },
      ];
    } else {
      return [
        {
          label: 'Мои заявки',
          link: '/',
          active: false,
          status: -1,
        },
        {
          label: 'Мои заказы',
          link: '/',
          active: false,
          status: -3,
        },
        {
          label: 'Созданные',
          link: '/',
          active: false,
          status: 0,
        },
        {
          label: 'Опубликованные',
          link: '/',
          active: false,
          status: 1,
        },
        {
          label: 'Исполненные',
          link: '/',
          active: false,
          status: 2,
        },
        {
          label: 'Архивированные',
          link: '/',
          active: false,
          status: 3,
        },
      ];
    }
  });
}
