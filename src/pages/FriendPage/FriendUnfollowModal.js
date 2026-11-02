import React, { useEffect } from "react";
import "../../styles/FriendUnfollowModal.css";

function FriendUnfollowModal({
  isOpen,
  friend,
  onConfirm,
  onClose,
  isSubmitting = false,
  error = "",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayName = friend?.name ?? "";
  const displayTag = friend?.tag
    ? `#${friend.tag}`
    : "";

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="friend-unfollow-modal__overlay"
      onClick={handleOverlayClick}
    >
      <div
        className="friend-unfollow-modal__content"
        role="dialog"
        aria-modal="true"
        aria-label="언팔로우 확인"
        aria-busy={isSubmitting}
      >
        <p className="friend-unfollow-modal__text">
          <span className="friend-unfollow-modal__name">
            {displayName}
          </span>{" "}
          <span className="friend-unfollow-modal__tag">
            {displayTag}
          </span>
          님을 팔로우 목록에서
          <br />
          삭제하시겠습니까?
        </p>

        {error && <p role="alert">{error}</p>}

        <div className="friend-unfollow-modal__actions">
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--yes"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "예"}
          </button>

          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--no"
            onClick={onClose}
            disabled={isSubmitting}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendUnfollowModal;
