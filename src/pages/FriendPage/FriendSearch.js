import React, { useEffect, useState } from "react";
import api from "../../Api";
import config from "../../Config";
import { toFriendModel } from "./friendModel";
import "../../styles/FriendSearch.css";
import searchIcon from "../../assets/icon/search.png";

// 닉네임 검색 요청: 검색어와 페이지 정보는 params로 전달합니다.
function requestSearch(nickname, page, signal) {
  return api.get(config.FOLLOW.SEARCH, {
    params: {
      nickname,
      page,
      size: 10,
    },
    signal,
  });
}

function FriendSearch({
  title = "팔로우 요청",
  placeholder = "닉네임으로 검색",
  onFollow,
  followingList = [],
  followingId = null,
  followError = "",
  followDisabled = false,
  refreshKey = 0,
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nickname = query.trim();

  useEffect(() => {
    if (!nickname) {
      setResults([]);
      setTotalPages(0);
      setError("");
      setLoading(false);
      return;
    }

    let active = true;
    const controller = new AbortController();

    setLoading(true);
    setError("");
    setResults([]);

    // 입력할 때마다 요청하지 않도록 300ms 기다린 뒤 검색합니다.
    const timer = setTimeout(async () => {
      try {
        const { data } = await requestSearch(
          nickname,
          page,
          controller.signal
        );

        if (
          data?.isSuccess === false ||
          !Array.isArray(data?.result?.content) ||
          !Number.isInteger(data.result.totalPages) ||
          data.result.totalPages < 0
        ) {
          throw new Error("검색 응답을 확인해 주세요.");
        }

        if (!active) return;

        // 팔로우로 마지막 페이지가 사라졌다면 유효한 페이지로 이동합니다.
        if (page > 0 && page >= data.result.totalPages) {
          setPage(Math.max(0, data.result.totalPages - 1));
          return;
        }

        setResults(data.result.content.map(toFriendModel));
        setTotalPages(data.result.totalPages);
      } catch {
        if (active) {
          setError("검색에 실패했습니다. 다시 시도해 주세요.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    // 검색어가 바뀌면 이전 타이머와 요청을 정리합니다.
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [nickname, page, retryCount, refreshKey]);

  const handleChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    // 새 검색을 기다리는 동안 예전 결과의 버튼을 누르지 않게 합니다.
    if (nextQuery.trim() !== nickname) {
      setPage(0);
      setResults([]);
      setError("");
    }
  };

  return (
    <section className="friend-search">
      <h2 className="friend-search__title">{title}</h2>

      <div className="friend-search__input-box">
        <span className="friend-search__icon" aria-hidden="true">
          <img
            src={searchIcon}
            alt="검색"
            className="friend-search__icon-img"
          />
        </span>

        <input
          className="friend-search__input"
          aria-label="닉네임 검색"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
        />
      </div>

      {followError && (
        <div className="friend-search__empty" role="alert">
          {followError}
        </div>
      )}

      {!nickname ? (
        <div className="friend-search__empty">
          검색할 닉네임을 입력해 주세요.
        </div>
      ) : loading ? (
        <div className="friend-search__empty" role="status">
          검색 중...
        </div>
      ) : error ? (
        <div className="friend-search__empty">
          <p role="alert">{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            다시 시도
          </button>
        </div>
      ) : results.length === 0 ? (
        <div className="friend-search__empty">검색 결과가 없습니다.</div>
      ) : (
        <ul className="friend-search__list">
          {results.map((user) => {
            const isFollowing = followingList.some(
              (friend) => friend.id === user.id
            );
            const isPending = followingId === user.id;

            return (
              <li key={user.id} className="friend-search__item">
                <div className="friend-search__left">
                  <div className="friend-avatar" aria-hidden="true">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="friend-avatar__img"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>

                  <div className="friend-info">
                    <div className="friend-info__top">
                      <span className="friend-info__name">{user.name}</span>
                      {user.tag && (
                        <span className="friend-info__tag">#{user.tag}</span>
                      )}
                    </div>

                    <div className="friend-info__bio">
                      {user.bio || "소개글이 없습니다."}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`friend-follow-btn ${
                    isFollowing ? "is-disabled" : ""
                  }`}
                  disabled={
                    isFollowing || followingId !== null || followDisabled
                  }
                  onClick={() => onFollow?.(user)}
                >
                  {isPending ? "처리 중..." : isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {nickname && !loading && !error && totalPages > 1 && (
        <div className="friend-search__pagination">
          <button
            type="button"
            disabled={page === 0 || followingId !== null}
            onClick={() => setPage((value) => value - 1)}
          >
            이전
          </button>
          <span> {page + 1} / {totalPages} </span>
          <button
            type="button"
            disabled={page + 1 >= totalPages || followingId !== null}
            onClick={() => setPage((value) => value + 1)}
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
}

function UserIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FriendSearch;
