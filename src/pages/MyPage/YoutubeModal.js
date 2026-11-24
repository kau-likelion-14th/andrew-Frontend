import React, { useEffect, useRef, useState } from "react";
import { del, get, post } from "../../Api";
import config from "../../Config";

// YouTube 검색 결과 제목에 포함된 HTML 엔티티(&#39;, &amp; 등)를 원래 문자로 변환
const decodeHtml = (text = "") =>
  new DOMParser().parseFromString(text, "text/html").documentElement
    .textContent ?? "";

const toSong = (item) => ({
  songId: item.songId,
  title: decodeHtml(item.title),
  artist: decodeHtml(item.artist),
  imageUrl: item.imageUrl,
});

const getMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

function YoutubeModal({ savedSongs, onSavedSongsChange, onClose }) {
  const [tab, setTab] = useState("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState("");

  const searchIdRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setError("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const keyword = query.trim();
    if (!keyword || isSearching) return;

    const searchId = ++searchIdRef.current;
    setIsSearching(true);
    setError("");

    try {
      const response = await get(config.YOUTUBE.SEARCH, {
        q: keyword,
        limit: 10,
      });

      if (searchId !== searchIdRef.current) return;

      setResults((response?.result ?? []).map(toSong));
      setSearched(true);
    } catch (err) {
      if (searchId !== searchIdRef.current) return;

      console.error("노래 검색 실패:", err);
      setError(getMessage(err, "노래 검색에 실패했습니다."));
    } finally {
      if (searchId === searchIdRef.current) setIsSearching(false);
    }
  };

  const handleSave = async (song) => {
    if (pendingId) return;

    setPendingId(song.songId);
    setError("");

    try {
      const response = await post(config.YOUTUBE.SAVE, {
        songId: song.songId,
      });
      const saved = response?.result ?? song;

      onSavedSongsChange((prev) => [
        saved,
        ...prev.filter((item) => item.songId !== saved.songId),
      ]);
    } catch (err) {
      console.error("노래 저장 실패:", err);
      setError(getMessage(err, "노래 저장에 실패했습니다."));
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (song) => {
    if (pendingId) return;

    setPendingId(song.songId);
    setError("");

    try {
      await del(config.YOUTUBE.DELETE(song.songId));

      onSavedSongsChange((prev) =>
        prev.filter((item) => item.songId !== song.songId)
      );
    } catch (err) {
      console.error("노래 삭제 실패:", err);
      setError(getMessage(err, "노래 삭제에 실패했습니다."));
    } finally {
      setPendingId(null);
    }
  };

  const savedIds = new Set(savedSongs.map((song) => song.songId));
  const songs = tab === "search" ? results : savedSongs;

  const emptyText =
    tab === "saved"
      ? "저장한 노래가 없습니다."
      : searched
      ? "검색 결과가 없습니다."
      : "노래 제목이나 가수를 검색해 보세요.";

  return (
    <div className="ytm-overlay" onClick={onClose}>
      <div
        className="ytm-modal"
        role="dialog"
        aria-modal="true"
        aria-label="좋아하는 노래"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ytm-header">
          <div className="ytm-title">좋아하는 노래</div>
          <button
            type="button"
            className="ytm-close"
            aria-label="닫기"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="ytm-tabs">
          <button
            type="button"
            className={`ytm-tab${tab === "search" ? " ytm-tab--active" : ""}`}
            aria-pressed={tab === "search"}
            onClick={() => changeTab("search")}
          >
            검색
          </button>
          <button
            type="button"
            className={`ytm-tab${tab === "saved" ? " ytm-tab--active" : ""}`}
            aria-pressed={tab === "saved"}
            onClick={() => changeTab("saved")}
          >
            저장한 노래 ({savedSongs.length})
          </button>
        </div>

        {tab === "search" && (
          <form className="ytm-searchRow" onSubmit={handleSearch}>
            <input
              className="ytm-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="노래 제목, 가수"
              aria-label="노래 검색어"
              autoFocus
            />
            <button
              type="submit"
              className="ytm-btn"
              disabled={!query.trim() || isSearching}
            >
              검색
            </button>
          </form>
        )}

        {isSearching && tab === "search" && (
          <div className="ytm-loading">검색 중...</div>
        )}
        {error && (
          <div className="ytm-error" role="alert">
            {error}
          </div>
        )}

        <div className="ytm-list">
          {songs.length === 0 && !isSearching && !error && (
            <div className="ytm-empty">{emptyText}</div>
          )}

          {songs.map((song) => (
            <div className="ytm-item" key={song.songId}>
              {song.imageUrl && (
                <img className="ytm-thumb" src={song.imageUrl} alt="" />
              )}
              <div className="ytm-itemText">
                <div className="ytm-itemTitle" title={song.title}>
                  {song.title}
                </div>
                <div className="ytm-itemSub">{song.artist}</div>
              </div>
              <div className="ytm-actions">
                {tab === "search" ? (
                  <button
                    type="button"
                    className="ytm-btn"
                    disabled={
                      savedIds.has(song.songId) || pendingId !== null
                    }
                    onClick={() => handleSave(song)}
                  >
                    {savedIds.has(song.songId) ? "저장됨" : "저장"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ytm-btn"
                    disabled={pendingId !== null}
                    onClick={() => handleDelete(song)}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default YoutubeModal;
