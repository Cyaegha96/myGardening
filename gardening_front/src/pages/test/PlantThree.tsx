
import { Canvas } from "@react-three/fiber";
import {Environment, OrbitControls, useGLTF} from "@react-three/drei";
import {Suspense, type JSX} from "react";

// 식물 GLB 모델 컴포넌트
function PlantModel(props: JSX.IntrinsicElements["group"]) {

    const { scene } = useGLTF("/assets/model/plant3.glb");// public/models/plant.glb 위치에 파일 두기

    return (
        <group {...props} dispose={null}>
            {/* 실제 GLB 모델 */}
            <primitive object={scene} />

        </group>
    );
}


export default function PlantThree() {



    return (
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}
                style={{ width: "100vw", height: "100vh", overflow: "hidden"}}
                gl={{ preserveDrawingBuffer: false, powerPreference: "high-performance", antialias: true }}

        >
            {/* 기본 조명 */}
            <ambientLight intensity={4} />

            {/* 방향광 (태양빛 느낌) */}
            <directionalLight
                position={[5, 10, 5]}
                intensity={3}

            />

            {/* 포인트 라이트 (전구처럼 특정 위치에서 빛나는 조명) */}
            <pointLight position={[0, 3, 3]} intensity={2} color="white" />

            <Suspense fallback={null}>
                <PlantModel scale={5} />

            </Suspense>

            <OrbitControls />

        </Canvas>

    );
}
