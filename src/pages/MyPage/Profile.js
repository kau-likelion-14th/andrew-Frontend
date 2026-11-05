import React, {useRef, useState} from "react";
import profileImg from "../../assets/img/profile.png";
import profileEdit from "../../assets/img/imgedit.png";
import profilemusic from "../../assets/img/search.png";

const Profile = () => {
  const fileInputRef = useRef(null);

  const [nickname] = useState("Likelion#1253");
  const [intro, setIntro] = useState("안녕하세요");
  const [song, setSong] = useState("내꺼하자 - 인피니트");

  const [profileImageUrl] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleSave = () => {
    console.log("저장될 프로필 데이터:", {
      intro,
      song,
      selectedImageFile,
    });

    alert("프로필이 임시로 저장됐어요! (API 연결 전)");
  };

  return (
    <div className="profile-container">
        <div className="profile-section">
            <div className="profile-image">
                <img 
                    src={displayImageSrc} 
                    alt="프로필 이미지" 
                    className="profile-img" 
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
                    <div className="profile-content">
                        <input
                            className="profile-content-input"
                            value={`🎵 ${song}`}
                            onChange={(e) => setSong(e.target.value)}
                        />
                    </div>
                    <img
                        src={profilemusic}
                        alt="프로필 노래 수정 아이콘"
                        className="profile-search-icon"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Profile;