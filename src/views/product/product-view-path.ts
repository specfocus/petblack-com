import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { VIEWS_PATH } from '../views-path';

export const PRODUCT_VIEW_PATH: WorkspacePath = [...VIEWS_PATH, 'product'] as const;
