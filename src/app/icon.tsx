import { ImageResponse } from 'next/og';

export const size = {
    width: 512,
    height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle at 30% 25%, #2f2f2f 0%, #111111 45%, #000000 100%)',
                    color: '#f5b700',
                    fontSize: 152,
                    fontWeight: 800,
                    letterSpacing: -4,
                    borderRadius: 110,
                    border: '16px solid #f5b700',
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
