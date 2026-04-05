import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { WIDGETS_PATH } from '@/widgets/widgets-path';

export const PICK_WIDGET_PATH: WorkspacePath = [...WIDGETS_PATH, 'pick'] as const;
export const PICK_OPEN_TOGGLE_PATH: WorkspacePath = [...PICK_WIDGET_PATH, 'toggles', 'open'] as const;
export const PICK_SHOW_TOGGLE_PATH: WorkspacePath = [...PICK_WIDGET_PATH, 'toggles', 'show'] as const;
