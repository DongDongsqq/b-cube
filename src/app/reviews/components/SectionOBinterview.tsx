"use client";

import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import ActivityButton from "@/components/activityButton";

const SectionOBinterview = () => {
  const [postData, setPostData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6); // 초기값 6

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/ob-interviews`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setPostData(data);
        setError(null);
      })
      .catch((error) => {
        console.log("데이터를 불러오는데 실패했습니다:", error);
        setError("데이터를 불러오는데 실패했습니다.");
      });
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  // 총 데이터가 3의 배수 + 1인지 확인
  const isLastCardCentered =
    postData.length % 3 === 1 && postData.length <= visibleCount;

  return (
    <div className="section-ob-interview flex flex-col justify-center items-center mt-36 mb-32">
      {/* 그리드 컨테이너 */}
      <div
        className="grid-container grid w-full"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)", // 한 줄에 3개
          gap: "20px",
          maxWidth: "1200px", // 그리드 너비를 제한
          width: "100%", // 부모 너비에 맞춤
          padding: "0 120px", // 좌우 패딩
          justifyContent: "center", // 그리드 컨테이너를 중앙으로 정렬
        }}
      >
        {error ? (
          <p className="text-red-500">{error}</p> // 에러 메시지 표시
        ) : postData.length > 0 ? (
          postData.slice(0, visibleCount).map((post, index) => {
            // 마지막 카드가 3의 배수 + 1일 때 가운데 정렬
            const isLastCard =
              isLastCardCentered &&
              index === postData.slice(0, visibleCount).length - 1;

            return (
              <div
                key={post.id}
                className={`${
                  isLastCard ? "md:col-span-3 flex justify-center" : ""
                }`}
              >
                <ProfileCard
                  name={post.name}
                  studentId={post.studentId}
                  message={post.message}
                  imageUrl={post.imageUrl}
                  className="w-full h-full max-w-[250px] max-h-[350px]" // 프로필 카드 크기 고정
                />
              </div>
            );
          })
        ) : (
          <p>로딩 중...</p>
        )}
      </div>

      {/* "더보기" 버튼을 프로필 카드 아래에 배치 */}
      {visibleCount < postData.length && (
        <section className="flex justify-center items-center w-full mt-24 mb-32">
          <ActivityButton
            activity="더보기"
            selected={true}
            onClick={handleLoadMore}
          />
        </section>
      )}
    </div>
  );
};

export default SectionOBinterview;
