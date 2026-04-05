import { renderPawPng } from '../paw-icon';

export const dynamic = 'force-static';
export const revalidate = false;

export const GET = () => renderPawPng(120);
