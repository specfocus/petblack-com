import type { WorkspacePath } from '@specfocus/atoms/lib/workspace';
import { APPLICATIONS_PATH } from '@specfocus/shelly/lib/applications/applications-entry';

export const APP = 'shoppify';

export const APP_PATH: WorkspacePath = [...APPLICATIONS_PATH, APP] as const;
