import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { WIDGETS_PATH } from '../widgets-path';

export const BUDDY_WIDGET_PATH: WorkspacePath = [...WIDGETS_PATH, 'buddy'];
export const BUDDY_SHOW_TOGGLE_PATH: WorkspacePath = [...BUDDY_WIDGET_PATH, 'toggles', 'show'];
export const BUDDY_OPEN_TOGGLE_PATH: WorkspacePath = [...BUDDY_WIDGET_PATH, 'toggles', 'open'];
