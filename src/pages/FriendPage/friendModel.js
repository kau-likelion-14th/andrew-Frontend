// 목록 조회, 검색, 팔로우 응답을 동일한 UI 모델로 변환합니다.
export function toFriendModel(user) {
  if (user?.userId == null) throw new Error("사용자 ID가 없습니다.");
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
