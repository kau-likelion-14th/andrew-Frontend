// 서버 응답의 사용자 정보를 친구 UI가 사용하는 형태로 변환합니다.
export function toFriendModel(user) {
  if (user?.userId == null) {
    throw new Error("사용자 ID가 없습니다.");
  }

  const [name, tag = ""] = (user.userName || "").split("#");

  return {
    id: String(user.userId),
    userId: user.userId,
    name: name || "이름 없음",
    tag,
    bio: user.introduction || "",
    profileImageUrl: user.profileImageUrl || null,
  };
}
