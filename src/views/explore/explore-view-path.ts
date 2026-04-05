import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { VIEWS_PATH } from '../views-path';

export const EXPLORE_VIEW_PATH: WorkspacePath = [...VIEWS_PATH, 'explore'] as const;
