// src/components/layout/ParticleBackground.tsx
"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm"; // Maath 是 R3F 生态常用的数学库
import * as THREE from "three";

function StarField(props: any) {
  const ref = useRef<THREE.Points>(null!);

  // 1. 生成 5000 个随机点，分布在一个半径为 1.5 的球体内
  // Float32Array 是为了高性能渲染
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.5 }) as Float32Array
  );

  useFrame((state, delta) => {
    // 让星空保持自动旋转 (这里不用改)
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // 视差效果：根据鼠标位置微调
    const x = state.mouse.x * 0.2;
    const y = -state.mouse.y * 0.2;

    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, y, 0.1);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x, 0.1);
  });


  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff" // 纯白粒子，配合黑色背景非常干净
          size={0.002}    // 粒子极其细小，像灰尘一样精致
          sizeAttenuation={true} // 远处的粒子变小，近处变大
          depthWrite={false} // 关闭深度写入，防止粒子互相遮挡产生黑边
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-[#050505]">
      {/* camera position z: 1 表示我们离粒子非常近，有穿梭其中的感觉 */}
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: false }}>
        {/* 稍微加一点背景色变体，防止纯黑太死板，这里用极淡的雾 */}
        <fog attach="fog" args={['#050505', 0.5, 2.5]} />
        <StarField />
      </Canvas>
    </div>
  );
}