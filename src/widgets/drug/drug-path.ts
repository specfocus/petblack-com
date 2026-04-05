import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { WIDGETS_PATH } from '@/widgets/widgets-path';

export const DRUG_WIDGET_PATH: WorkspacePath = [...WIDGETS_PATH, 'drug'] as const;

export const DRUG_TOGGLE_PATH: WorkspacePath = [...DRUG_WIDGET_PATH, 'toggles', 'show'] as const;
