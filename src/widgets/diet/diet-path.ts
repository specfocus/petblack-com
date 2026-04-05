import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { WIDGETS_PATH } from '@/widgets/widgets-path';

export const DIET_WIDGET_PATH: WorkspacePath = [...WIDGETS_PATH, 'diet'] as const;
export const DIET_OPEN_TOGGLE_PATH: WorkspacePath = [...DIET_WIDGET_PATH, 'toggles', 'open'] as const;
export const DIET_SHOW_TOGGLE_PATH: WorkspacePath = [...DIET_WIDGET_PATH, 'toggles', 'show'] as const;

export const DIET_TOGGLE_PATH = DIET_SHOW_TOGGLE_PATH;
