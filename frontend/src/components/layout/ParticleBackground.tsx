// src/components/layout/ParticleBackground.tsx
"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// --- 手动生成球体分布粒子的函数 ---
// 这能保证生成的 Float32Array 绝对干净，没有 NaN
function generateSpherePositions(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // 使用球坐标系生成均匀分布的点
    const r = radius * Math.cbrt(Math.random()); // 开立方根以保证球体内部均匀分布，而不是聚集在圆心
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

function StarField(props: any) {
  const ref = useRef<THREE.Points>(null!);

  // 使用 useMemo 替代 useState，性能更好，且确保只计算一次
  const sphere = useMemo(() => generateSpherePositions(5000, 1.5), []);

  useFrame((state, delta) => {
    // 自动旋转
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // 视差效果 (反向跟随鼠标)
    const x = -state.mouse.x * 0.2;
    const y = state.mouse.y * 0.2;

    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, y, 0.1);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x, 0.1);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: false }}>
        <fog attach="fog" args={['#050505', 0.5, 2.5]} />
        <StarField />
      </Canvas>
    </div>
  );
}