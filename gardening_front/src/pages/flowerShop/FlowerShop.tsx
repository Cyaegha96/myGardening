import { useState, useEffect } from "react";
import { PlaceItem } from "@/features/flowerShop/PlaceItem.tsx";

declare global {
    interface Window {
        kakao: any;
    }
}

export default function FlowerShop() {
    const [places, setPlaces] = useState<any[]>([]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
            import.meta.env.VITE_KAKAO_JS_KEY
        }&autoload=false&libraries=services`;
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById("map");
                if (!container) return;

                // 지도, 서비스, 마커 관련 객체를 외부에 선언하여 모든 함수에서 접근 가능하도록 합니다.
                let map: any;
                let ps: any;
                const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
                let markers: any[] = []; // 꽃집 마커들
                let centerMarker: any = null; // 검색 기준 위치 마커 (내 위치 또는 검색된 장소)

                map = new window.kakao.maps.Map(container, {
                    center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 초기 서울 시청 위치
                    level: 3,
                });
                ps = new window.kakao.maps.services.Places();

                // ----------------------------------------------------
                // 헬퍼 함수
                // ----------------------------------------------------

                // 검색 결과 목록과 마커를 표출하는 함수
                function displayPlaces(placesData: any[]) {
                    setPlaces(placesData);
                    removeFlowerShopMarkers();

                    if (placesData.length === 0) return;

                    const bounds = new window.kakao.maps.LatLngBounds();

                    for (let i = 0; i < placesData.length; i++) {
                        const placePosition = new window.kakao.maps.LatLng(
                            placesData[i].y,
                            placesData[i].x
                        );
                        const marker = addFlowerShopMarker(placePosition, i);
                        bounds.extend(placePosition);

                        // 마커 이벤트 등록
                        ((marker, place) => {

                            const title = place.place_name;
                            const description = place.road_address_name;

                            window.kakao.maps.event.addListener(marker, "mouseover", () => {
                                displayInfowindow(marker, title,description);
                            });
                            window.kakao.maps.event.addListener(marker, "mouseout", () => {
                                infowindow.close();
                            });
                            window.kakao.maps.event.addListener(marker, "click", () => {
                                window.open(place.place_url, "_blank");
                            });
                        })(marker, placesData[i]);
                    }

                    // 검색 결과가 많을 경우 지도를 결과에 맞게 조정합니다.
                    // 단, 명확한 검색 기준점(centerMarker)이 있을 때는 제외합니다.
                    if (!centerMarker) {
                        map.setBounds(bounds);
                    }
                }

                // 꽃집 마커 생성
                function addFlowerShopMarker(position: any, idx: number) {
                    const imageSrc = "assets/flower-marker.png";
                    const imageSize = new window.kakao.maps.Size(50, 50);

                    const markerImage = new window.kakao.maps.MarkerImage(
                        imageSrc,
                        imageSize
                    );
                    const marker = new window.kakao.maps.Marker({
                        position,
                        image: markerImage,
                    });
                    marker.setMap(map);
                    markers.push(marker);
                    return marker;
                }

                // 꽃집 마커 제거
                function removeFlowerShopMarkers() {
                    for (let i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                    }
                    markers = [];
                }

                // 인포윈도우 표시
                function displayInfowindow(marker: any, content: string,description?:string ) {

                    infowindow.setContent(
                        `<div style="padding:5px;font-size:12px;">${content}</div>
                        <div style="padding:5px;font-size:12px;">${description}</div>`
                    );
                    infowindow.open(map, marker);
                }

                // 검색 중심 위치 마커 설정
                function setCenterMarker(position: any, title: string) {
                    if (centerMarker) {
                        centerMarker.setMap(null);
                    }

                    // 중심 마커는 기본 마커를 사용하여 꽃집 마커와 구분합니다.
                    centerMarker = new window.kakao.maps.Marker({
                        position: position,
                        title: title,

                    });
                    centerMarker.setMap(map);

                    // 중심 마커에 인포윈도우 표시 (굵은 글씨로 강조)
                    displayInfowindow(centerMarker, `<div style="font-weight:bold;">${title}</div>`);

                    // 지도 이동/확대 시 인포윈도우 닫기
                    const closeInfowindow = () => infowindow.close();
                    window.kakao.maps.event.addListener(map, 'dragstart', closeInfowindow);
                    window.kakao.maps.event.addListener(map, 'zoom_start', closeInfowindow);
                }


                // ----------------------------------------------------
                // 핵심 기능: 일반 장소 검색 후 해당 위치 기준으로 꽃집 검색
                // ----------------------------------------------------

                function searchPlaces(keyword: string) {
                    if (!keyword.trim()) {
                        alert("키워드를 입력해주세요!");
                        return;
                    }

                    // 1단계: 입력 키워드를 검색하여 위치 좌표를 찾습니다.
                    ps.keywordSearch(
                        keyword,
                        (data: any, status: any) => {
                            if (status === window.kakao.maps.services.Status.OK && data.length > 0) {

                                const targetPlace = data[0];
                                const targetPosition = new window.kakao.maps.LatLng(targetPlace.y, targetPlace.x);

                                // 지도 중심 이동 및 레벨 초기화
                                map.setCenter(targetPosition);
                                map.setLevel(3);

                                // 검색 기준 위치 마커 설정
                                setCenterMarker(targetPosition, targetPlace.place_name);

                                // 2단계: 찾아낸 위치를 중심으로 "꽃집"을 검색합니다.
                                ps.keywordSearch(
                                    "꽃집",
                                    (flowerData: any, flowerStatus: any) => {
                                        if (flowerStatus === window.kakao.maps.services.Status.OK) {
                                            displayPlaces(flowerData); // 꽃집 결과 표시
                                        } else {
                                            alert(`${targetPlace.place_name} 주변 2km 내에 꽃집 검색 결과가 없습니다.`);
                                            setPlaces([]);
                                            removeFlowerShopMarkers();
                                        }
                                    },
                                    {
                                        location: targetPosition, // 1단계에서 찾은 위치를 기준으로 검색
                                        radius: 2000,
                                    }
                                );

                            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                                alert("검색하신 장소 키워드에 대한 결과가 없습니다.");
                                setPlaces([]);
                                removeFlowerShopMarkers();
                                if(centerMarker) centerMarker.setMap(null); // 이전 중심 마커 제거
                            } else {
                                alert("장소 검색 중 오류가 발생했습니다.");
                            }
                        },
                        {} // 키워드 검색 시 위치 편향 없음
                    );
                }

                // ----------------------------------------------------
                // 핵심 기능: 현재 위치로 돌아가기
                // ----------------------------------------------------

                function resetToCurrentLocation() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const lat = position.coords.latitude;
                                const lng = position.coords.longitude;
                                const locPosition = new window.kakao.maps.LatLng(lat, lng);

                                map.setCenter(locPosition);
                                map.setLevel(3);

                                setCenterMarker(locPosition, "현재 위치"); // 현재 위치를 중심 마커로 설정

                                // 현재 위치 기준으로 "꽃집" 검색
                                ps.keywordSearch(
                                    "꽃집",
                                    (data: any, status: any) => {
                                        if (status === window.kakao.maps.services.Status.OK) {
                                            displayPlaces(data);
                                        } else {

                                        }
                                    },
                                    {
                                        location: locPosition,
                                        radius: 2000,
                                    }
                                );
                            },
                            (error) => {
                                console.error("현재 위치를 가져올 수 없습니다:", error);

                            }
                        );
                    } else {
                        alert("이 브라우저에서는 Geolocation을 지원하지 않습니다.");
                    }
                }

                // ----------------------------------------------------
                // 이벤트 리스너 연결 및 초기 로드
                // ----------------------------------------------------

                // 초기 로드 시 현재 위치 기준으로 검색 시작
                if (navigator.geolocation) {
                    resetToCurrentLocation();
                }

                const searchButton = document.getElementById("search-button");
                const searchInput = document.getElementById("search-keyword") as HTMLInputElement;
                const resetButton = document.getElementById("reset-location-button");

                if (searchButton && searchInput) {
                    searchButton.onclick = () => searchPlaces(searchInput.value);
                    searchInput.onkeyup = (e) => {
                        if (e.key === "Enter") {
                            searchPlaces(searchInput.value);
                        }
                    };
                }

                if (resetButton) {
                    resetButton.onclick = resetToCurrentLocation;
                }
            });
        };

        document.head.appendChild(script);
    }, []);

    // ----------------------------------------------------
    // 렌더링 (UI)
    // ----------------------------------------------------

    return (
        <div style={{ display: "flex", position: "relative" }}>
            <div
                id="menu_wrap"
                style={{ width: "250px", height: "400px", overflowY: "scroll" }}
            >
                <ul style={{ padding: 0, listStyle: "none" }}>
                    {places.map((place, i) => (
                        <PlaceItem key={i} index={i} place={place} />
                    ))}
                </ul>
            </div>
            <div id="map" style={{ width: "100%", height: "400px" }} />

            {/* 지도 위에 오버레이될 검색 UI */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "260px",
                    zIndex: 10,
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    display: "flex",
                    gap: "5px",
                }}
            >
                <input
                    id="search-keyword"
                    type="text"
                    placeholder="장소 또는 키워드 검색"
                    style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "3px" }}
                />
                <button
                    id="search-button"
                    style={{ padding: "5px 10px", backgroundColor: "#3385ff", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                >
                    장소 검색
                </button>
                <button
                    id="reset-location-button"
                    style={{ padding: "5px 10px", backgroundColor: "#ff5722", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                >
                    내 위치로
                </button>
            </div>
        </div>
    );
}