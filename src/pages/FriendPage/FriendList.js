import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/icon/delete.png";
import "../../styles/FriendList.css";

function FriendList({
  title = "팔로우 목록",
  friends = [],
  onClickRemove,
  emptyText = "팔로우하는 친구가 없습니다.",
  loading = false,
  error = "",
  onRetry,
}) {
  const navigate = useNavigate();

  const goFriendDetail = (friend) => {
    navigate(`/friends/${friend.id}`, {
      state: { friend },
    });
  };

  return (
    <section className="friend-list">
      <h2 className="friend-list__title">{title}</h2>

      {loading ? (
        <div
          className="friend-list__empty"
          role="status"
        >
          팔로우 목록을 불러오는 중...
        </div>
      ) : error ? (
        <div className="friend-list__empty">
          <p role="alert">{error}</p>

          <button type="button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      ) : friends.length === 0 ? (
        <div className="friend-list__empty">
          {emptyText}
        </div>
      ) : (
        <ul className="friend-list__items">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="friend-list__item"
            >
              <div
                className="friend-list__left"
                role="button"
                tabIndex={0}
                onClick={() => {
                  goFriendDetail(friend);
                }}
              >
                <div
                  className="friend-avatar"
                  aria-hidden="true"
                >
                  {friend.profileImageUrl ? (
                    <img
                      className="friend-avatar__img"
                      src={friend.profileImageUrl}
                      alt="프로필 사진"
                    />
                  ) : (
                    <UserIcon />
                  )}
                </div>

                <div className="friend-info">
                  <div className="friend-info__top">
                    <span className="friend-info__name">
                      {friend.name}
                    </span>

                    {friend.tag && (
                      <span className="friend-info__tag">
                        #{friend.tag}
                      </span>
                    )}
                  </div>

                  {friend.bio ? (
                    <div className="friend-info__bio">
                      {friend.bio}
                    </div>
                  ) : (
                    <div className="friend-info__empty">
                      소개글이 없습니다.
                    </div>
                  )}
                </div>
              </div>

              <button
                className="friend-remove-btn"
                type="button"
                aria-label="삭제"
                onClick={(event) => {
                  event.stopPropagation();
                  onClickRemove?.(friend);
                }}
              >
                <img
                  className="friend-remove-icon"
                  src={deleteIcon}
                  alt="삭제 아이콘"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function UserIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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

export default FriendList;
