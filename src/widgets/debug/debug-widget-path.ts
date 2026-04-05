import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { WIDGETS_PATH } from '@specfocus/shelly/lib/widgets/widgets-path';

export const DEBUG_WIDGET_PATH: WorkspacePath = [...WIDGETS_PATH, 'debug'];
export const DEBUG_SHOW_TOGGLE_PATH: WorkspacePath = [...DEBUG_WIDGET_PATH, 'toggles', 'show'];
export const DEBUG_OPEN_TOGGLE_PATH: WorkspacePath = [...DEBUG_WIDGET_PATH, 'toggles', 'open'];
