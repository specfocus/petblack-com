import { ImageResponse } from 'next/og';

export const size = {
    width: 180,
    height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#000000',
                    color: '#f5b700',
                    fontSize: 64,
                    fontWeight: 800,
                    letterSpacing: -2,
                    borderRadius: 42,
                    border: '6px solid #f5b700',
                    boxSizing: 'border-box',
                    fontFamily: 'Arial, sans-serif',
                }}
            >
                PB
            </div>
        ),
        {
            ...size,
        }
    );
}
