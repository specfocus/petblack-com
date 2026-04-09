import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { WIDGETS_PATH } from '@/widgets/widgets-path';

export const BUDGET_WIDGET_PATH: WorkspacePath = [...WIDGETS_PATH, 'budget'] as const;
export const BUDGET_SHOW_TOGGLE_PATH: WorkspacePath = [...BUDGET_WIDGET_PATH, 'toggles', 'show'] as const;
export const BUDGET_OPEN_TOGGLE_PATH: WorkspacePath = [...BUDGET_WIDGET_PATH, 'toggles', 'open'] as const;
