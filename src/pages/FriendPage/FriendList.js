import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/icon/delete.png";
import "../../styles/FriendList.css";

function FriendList(
  {
    title = "팔로우 목록", // 부모 컴포넌트로부터 전달받은 목록 제목 (props)
    friends = [],        // 부모의 state에서 관리되는 친구 데이터 배열 (props)
    onClickRemove,       // 삭제 버튼 클릭 시 실행될 부모의 함수 (함수 전달)
    emptyText = "팔로우하는 친구가 없습니다.",
  }
) {
  const navigate = useNavigate(); // 페이지 이동을 제어하는 Hook

  // 친구 항목 클릭 시 실행: 상세 페이지 경로에 친구의 고유 id를 포함하여 이동
  const goFriendDetail = (friend) => {
    // 수정된 부분: /friends/123 처럼 id를 포함하고, state로 해당 친구 정보를 전달함
    navigate(`/friends/${friend.id}`, { state: { friend } });
  };

  return (
    <section className="friend-list">
      <h2 className="friend-list__title">{title}</h2>

      {/* 배열의 길이를 확인하여 데이터 유무에 따른 조건부 렌더링 수행 */}
      {friends.length === 0 ? (
        <div className="friend-list__empty">{emptyText}</div>
      ) : (
        <ul className="friend-list__items">
          {/* friends 배열을 순회하며 각 친구 객체를 li 요소로 생성함 */}
          {friends.map((friend) => (
            <li key={friend.id} className="friend-list__item">
              <div
                className="friend-list__left"
                role="button"
                tabIndex={0}
                onClick={() => {
                  goFriendDetail(friend); // 상세 페이지 이동 함수 호출
                }}
                >

                <div className="friend-avatar" aria-hidden="true">
                  {/* 프로필 이미지 URL 존재 여부에 따른 삼항 연산자 처리 */}
                  {friend.profileImageUrl ? (
                    <img
                      className="friend-avatar__img"
                      src={friend.profileImageUrl}
                      alt="프로필 사진"
                      />
                  ) : (
                    <UserIcon/>
                  )}
                </div>

                <div className="friend-info">
                  <div className = "friend-info__top">
                    {/* 친구 객체의 속성(name, tag)을 출력 */}
                    <span className="friend-info__name">{friend.name}</span>
                    <span className="friend-info__tag">#{friend.tag}</span>
                  </div>

                  {/* 소개글(bio)이 있을 때만 렌더링하거나 기본 문구 노출 */}
                  {friend.bio ?(
                    <div className="friend-info__bio">{friend.bio}</div>
                  ) : (
                    <div className="friend-info__empty">소개글이 없습니다.</div>
                  )}
                </div>
              </div>

              <button
                className="friend-remove-btn"
                type="button"
                aria-label="삭제"
                onClick={(e)=>{
                  e.stopPropagation(); // 이벤트 전파 중단: li 클릭 이벤트가 실행되지 않게 함
                  onClickRemove?.(friend); // 부모로부터 전달받은 삭제 처리 함수 실행
                }}
                >
                  <img className="friend-remove-icon" src={deleteIcon} alt="삭제 아이콘" />
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

export default FriendList;