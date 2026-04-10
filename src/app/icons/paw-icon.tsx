import { ImageResponse } from 'next/og';
import { PawSvg } from './paw-svg';

export { PawSvg } from './paw-svg';

export const renderPawPng = (size: number) =>
    new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                }}
            >
                <PawSvg size={Math.round(size * 0.82)} fill="#000000" />
            </div>
        ),
        {
            width: size,
            height: size,
            headers: {
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        }
    );
