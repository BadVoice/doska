import type { DefineComponent } from 'vue';

export interface IButton {
  label: string;
  link: string | null;
  fullmatch?: boolean;
  icon: DefineComponent<{}, {}, any> | null;
}
