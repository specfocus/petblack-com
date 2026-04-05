import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { WIDGETS_PATH } from '@/widgets/widgets-path';

export const LIST_WIDGET_PATH: WorkspacePath = [...WIDGETS_PATH, 'list'] as const;

export const LIST_TOGGLE_PATH: WorkspacePath = [...LIST_WIDGET_PATH, 'toggles', 'show'] as const;
