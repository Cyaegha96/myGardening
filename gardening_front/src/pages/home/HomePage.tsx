import { Button } from "@/shared/shadcn/components/ui/button";
import DomeGallery from "@/shared/shadcn/components/DomeGallery.tsx";
import {Link} from "react-router-dom";
import PlantThree from "@/pages/test/PlantThree.tsx";

export function Hero() {
    return (
        <>
            <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Video */}
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/assets/videos/hero.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline/>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50"/>

                {/* Content */}
                <div className="relative z-10 max-w-3xl px-6 text-center text-white">

                    <p className="mt-4 text-lg md:text-xl text-white/90">
                        마이가드닝에서 내 식물을 등록해보세요<br/>
                        다른 이용자들과 식물 관련 이야기를 나눠보세요.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <Button size="lg" className="px-8 text-lg">
                            내 식물 등록
                        </Button>

                    </div>
                </div>
            </section>
            <section style={{ overflowX: 'hidden' }}>
                <div style={{width: '100vw', height: '100vh'}} >

                    <DomeGallery/>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: '100vh',
                        left: '50%',

                        transform: 'translateX(-50%)',
                        color: 'white',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                        pointerEvents: 'none',
                    }}
                >
                    사용자들이 궁금해한 식물 사진들을 확인해보세요

                </div>
                <Link to="/plant-search"
                 style={{
                     position: 'absolute',
                     top: '110vh',
                     left: '50%',

                     transform: 'translateX(-50%)',

                 }}>
                    <Button size="lg" className="px-8 text-lg">
                        식물 검색하기
                    </Button>
                </Link>
            </section>

        </>
    );
}



export default function HomePage() {
    return (
       <Hero/>
    );
}