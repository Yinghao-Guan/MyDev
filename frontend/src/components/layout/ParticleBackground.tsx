"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// --- 保持原本的粒子生成函数 ---
function generateSpherePositions(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
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
  const pointsRef = useRef<THREE.Points>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  // [新增]: 手动追踪鼠标位置
  // 我们不使用 useFrame 自带的 state.mouse，因为 Canvas 被上层 UI (Terminal) 遮挡了
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // 将坐标归一化到 -1 到 1 之间 (与 Three.js 标准坐标系一致)
      mousePos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const sphere = useMemo(() => generateSpherePositions(5000, 1.5), []);

  useFrame((state, delta) => {
    // 1. 自动自转 (Points 层)
    if (pointsRef.current) {
      pointsRef.current.rotation.x -= delta / 10;
      pointsRef.current.rotation.y -= delta / 15;
    }

    // 2. 鼠标交互 (Group 层)
    // 这里改用我们自己的 mousePos.current
    if (groupRef.current) {
      const x = -mousePos.current.y * 0.15;
      const y = mousePos.current.x * 0.15;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, x, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, y, 0.1);
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false} {...props}>
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
    // [CSS]: 既然我们用了全局监听，这里的 pointer-events-none 可以加回来
    // 这样能确保背景绝对不会阻挡任何潜在的底层交互（虽然目前是底层）
    <div className="absolute inset-0 z-0 bg-[#050505] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: false }}>
        <fog attach="fog" args={['#050505', 0.5, 2.5]} />
        <StarField />
      </Canvas>
    </div>
  );
}