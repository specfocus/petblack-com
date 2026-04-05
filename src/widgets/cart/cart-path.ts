import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { WIDGETS_PATH } from '@/widgets/widgets-path';

export const CART_WIDGET_PATH: WorkspacePath = [...WIDGETS_PATH, 'cart'] as const;

export const CART_TOGGLE_PATH: WorkspacePath = [...CART_WIDGET_PATH, 'toggles', 'show'] as const;
