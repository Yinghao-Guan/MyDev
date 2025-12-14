// frontend/src/app/icon.tsx
import { ImageResponse } from 'next/og';

// 路由配置 (Metadata)
export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// 图标生成逻辑
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX 元素
      <div
        style={{
          fontSize: 20,
          background: '#050505', // 极黑背景
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#22c55e', // 亮绿色 (Tailwind green-500)
          borderRadius: '20%', // 稍微圆角，像个 APP 图标，或者改成 '0px' 要纯正方块
          fontFamily: 'monospace',
          fontWeight: 900,
          border: '1px solid #333', // 微微的边框增加质感
        }}
      >
        &gt;_
      </div>
    ),
    // ImageResponse 选项
    {
      ...size,
    }
  );
}