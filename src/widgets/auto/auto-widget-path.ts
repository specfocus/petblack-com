import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { WIDGETS_PATH } from '@/widgets/widgets-path';

export const AUTO_WIDGET_PATH: WorkspacePath = [...WIDGETS_PATH, 'auto'] as const;
export const AUTO_OPEN_TOGGLE_PATH: WorkspacePath = [...AUTO_WIDGET_PATH, 'toggles', 'open'] as const;
export const AUTO_SHOW_TOGGLE_PATH: WorkspacePath = [...AUTO_WIDGET_PATH, 'toggles', 'show'] as const;
