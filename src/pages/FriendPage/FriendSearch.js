import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api";
import config from "../../Config";
import { toFriendModel } from "./friendModel";
import "../../styles/FriendSearch.css";
import searchIcon from "../../assets/icon/search.png";

function FriendSearch({
  title = "팔로우 요청", placeholder = "닉네임으로 검색", onFollow,
  followingList = [], followingId = null, followError = "",
  followDisabled = false, refreshKey = 0,
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState({ key: "", users: [], totalPages: 0, error: "" });
  const nickname = query.trim();
  const requestKey = JSON.stringify([nickname, page, refreshKey, retryCount]);
  // 이전 검색 결과가 입력 변경 후에도 클릭되지 않도록 결과의 요청을 구분합니다.
  const loading = result.key !== requestKey;
  const followingIds = useMemo(() => new Set(followingList.map((user) => user.id)), [followingList]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get(
          nickname ? config.FOLLOW.SEARCH : config.FOLLOW.AVAILABLE,
          {
            params: { ...(nickname ? { nickname } : {}), page, size: 10, sort: "id,ASC" },
            signal: controller.signal,
          }
        );
        const paged = data?.result;
        if (data?.isSuccess === false || !Array.isArray(paged?.content) ||
            !Number.isInteger(paged.totalPages) || paged.totalPages < 0) {
          throw new Error("잘못된 검색 응답");
        }
        const users = paged.content.map(toFriendModel);
        if (!active) return;
        // 관계 변경으로 마지막 페이지가 사라졌다면 존재하는 페이지로 이동합니다.
        if (page > 0 && page >= paged.totalPages) {
          setPage(Math.max(0, paged.totalPages - 1));
          return;
        }
        setResult({ key: requestKey, users, totalPages: paged.totalPages, error: "" });
      } catch {
        if (active) setResult({ key: requestKey, users: [], totalPages: 0,
          error: "사용자 목록을 불러오지 못했습니다. 다시 시도해 주세요." });
      }
    }, nickname ? 300 : 0);
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [nickname, page, requestKey]);

  const goFriendDetail = (friend) => {
    navigate("/friends/" + friend.id, { state: { friend } });
  };
  const busy = followingId !== null;

  return (
    <section className="friend-search">
      <h2 className="friend-search__title">{title}</h2>
      <div className="friend-search__input-box">
        <span className="friend-search__icon" aria-hidden="true">
          <img src={searchIcon} alt="" className="friend-search__icon-img" />
        </span>
        <input className="friend-search__input" aria-label="닉네임 검색" value={query}
          onChange={(event) => { setQuery(event.target.value); setPage(0); }}
          placeholder={placeholder} />
      </div>
      {followError && <p role="alert">{followError}</p>}
      {followDisabled && <p className="friend-search__empty">팔로우 목록을 확인하고 진행 중인 작업을 마친 뒤 팔로우할 수 있습니다.</p>}
      {loading ? (
        <p className="friend-search__empty" role="status">사용자 목록을 불러오는 중...</p>
      ) : result.error ? (
        <div className="friend-search__empty">
          <p role="alert">{result.error}</p>
          <button type="button" onClick={() => setRetryCount((count) => count + 1)}>다시 시도</button>
        </div>
      ) : result.users.length === 0 ? (
        <p className="friend-search__empty">
          {nickname ? "검색 결과가 없습니다." : "팔로우 가능한 사용자가 없습니다."}
        </p>
      ) : (
        <ul className="friend-search__list">
          {result.users.map((user) => {
            const isFollowing = followingIds.has(user.id);
            const disabled = isFollowing || busy || followDisabled;
            return (
              <li key={user.id} className="friend-search__item">
                <div className="friend-search__left" role="button" tabIndex={0}
                  onClick={() => goFriendDetail(user)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      goFriendDetail(user);
                    }
                  }}>
                  <div className="friend-avatar" aria-hidden="true">
                    {user.profileImageUrl
                      ? <img src={user.profileImageUrl} alt="" className="friend-avatar__img" />
                      : <UserIcon />}
                  </div>
                  <div className="friend-info">
                    <div className="friend-info__top">
                      <span className="friend-info__name">{user.name}</span>
                      {user.tag && <span className="friend-info__tag">#{user.tag}</span>}
                    </div>
                    <div className="friend-info__bio">{user.bio || "소개글이 없습니다."}</div>
                  </div>
                </div>
                <button type="button" className={"friend-follow-btn " + (disabled ? "is-disabled" : "")}
                  disabled={disabled}
                  onClick={(event) => { event.stopPropagation(); onFollow?.(user); }}>
                  {followingId === user.id ? "처리 중..." : isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {!loading && !result.error && result.totalPages > 1 && (
        <nav className="friend-search__pagination" aria-label="사용자 목록 페이지">
          <button type="button" disabled={page === 0 || busy} onClick={() => setPage((value) => value - 1)}>이전</button>
          <span>{page + 1} / {result.totalPages}</span>
          <button type="button" disabled={page + 1 >= result.totalPages || busy} onClick={() => setPage((value) => value + 1)}>다음</button>
        </nav>
      )}
    </section>
  );
}

function UserIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z" fill="#ffffff" opacity="0.9" />
      <path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default FriendSearch;