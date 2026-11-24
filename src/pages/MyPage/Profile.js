import React, { useCallback, useEffect, useRef, useState } from "react";
import profileImg from "../../assets/img/profile.png";
import profileEdit from "../../assets/img/imgedit.png";
import profilemusic from "../../assets/img/search.png";
import { get, put, uploadProfile } from "../../Api";
import config from "../../Config";
import YoutubeModal from "./YoutubeModal";

const Profile = () => {
  const fileInputRef = useRef(null);

  const [nickname, setNickname] = useState("Likelion#1253");
  const [intro, setIntro] = useState("안녕하세요");
  const [savedSongs, setSavedSongs] = useState([]);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);

  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchProfileData = useCallback(async () => {
    try {
      const response = await get(config.PROFILE.GET);
      const result = response?.result;

      if (!result) return;

      setNickname(result.username ?? "");
      setIntro(result.introduction ?? "");
      setProfileImageUrl(result.profileImageUrl ?? null);
    } catch (error) {
      console.error("프로필 데이터를 가져오는 중 오류 발생:", error);
    }
  }, []);

  const fetchSavedSongs = useCallback(async () => {
    try {
      const response = await get(config.YOUTUBE.ME);
      setSavedSongs(response?.result ?? []);
    } catch (error) {
      console.error("저장한 노래를 가져오는 중 오류 발생:", error);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
    fetchSavedSongs();
  }, [fetchProfileData, fetchSavedSongs]);

  const openSongModal = () => setIsSongModalOpen(true);
  const closeSongModal = useCallback(() => setIsSongModalOpen(false), []);

  // 서버가 최근 저장순으로 내려주므로 첫 번째 곡을 대표 곡으로 표시
  const favoriteSong = savedSongs[0];
  const favoriteSongText = favoriteSong
    ? [favoriteSong.title, favoriteSong.artist].filter(Boolean).join(" - ")
    : "";

  const handleClickEditIcon = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const displayImageSrc = previewUrl || profileImageUrl || profileImg;

  const handleSave = async () => {
    try {
      // 1. 한 줄 소개 수정
      await put(config.PROFILE.INTRO, {
        introduce: intro,
      });

      // 2. 새로운 이미지가 있을 때만 업로드
      if (selectedImageFile) {
        await uploadProfile(
          config.PROFILE.PUT,
          { imageFile: selectedImageFile },
          { imageField: "image" }
        );
      }

      // 3. 최신 프로필 조회
      await fetchProfileData();

      // 4. 이미지 미리보기 상태 초기화
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(null);
      setSelectedImageFile(null);

      alert("프로필이 저장되었습니다!");
    } catch (error) {
      console.error("프로필 저장 실패:", error);

      const message =
        error.response?.data?.message ?? "프로필 저장에 실패했습니다.";

      alert(message);
    }
  };

  return (
    <div className="profile-container">
        <div className="profile-section">
            <div className="profile-image">
                <img 
                    src={displayImageSrc} 
                    alt="프로필 이미지" 
                    className="profile-img" 
                    onError={(e) => {
                      if (e.currentTarget.getAttribute("src") !== profileImg) {
                        e.currentTarget.src = profileImg;
                      }
                    }}
                />
                <img
                    src={profileEdit}
                    alt="프로필 수정 아이콘"
                    className="profile-img-edit"
                    onClick={handleClickEditIcon}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </div>
            <div className="profile-name">
                    {nickname}
            </div>
            <button className="profile-edit" onClick={handleSave}>프로필 저장</button>
        </div>
        <div className="profile-info">
            <div className="profile-details">
                <div className="profile-title">
                    한 줄 소개
                </div>
                <div className="profile-content-box">
                    <div className="profile-content">
                        <input
                            className="profile-content-input"
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="profile-details">
                <div className="profile-title">
                    좋아하는 노래
                </div>
                <div className="profile-content-box">
                    <span aria-hidden="true">🎵</span>
                    <div className="profile-content">
                        <input
                            className="profile-content-input"
                            value={favoriteSongText}
                            placeholder="좋아하는 노래를 검색해 보세요"
                            readOnly
                            onClick={openSongModal}
                        />
                    </div>
                    <img
                        src={profilemusic}
                        alt="프로필 노래 수정 아이콘"
                        className="profile-search-icon"
                        onClick={openSongModal}
                    />
                </div>
            </div>
        </div>
        {isSongModalOpen && (
            <YoutubeModal
                savedSongs={savedSongs}
                onSavedSongsChange={setSavedSongs}
                onClose={closeSongModal}
            />
        )}
    </div>
  );
};

export default Profile;