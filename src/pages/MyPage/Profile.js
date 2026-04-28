import React, { useState, useRef } from 'react';

const Profile = ({ profileImageUrl }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClickEditIcon = () => {
    fileInputRef.current?.click();
  };

  const displayImageSrc = previewUrl || profileImageUrl;
  const hasImage = !!displayImageSrc;

  return (
    <div className="profile-container-wrapper">
      {/* 프로필 상단: 이미지와 닉네임, 저장 버튼 */}
      <div className="profile-section">
        <div className="profile-left">
          <div className="profile-image-container">
            {hasImage ? (
              <img src={displayImageSrc} alt="Profile" className="profile-img" />
            ) : (
              <div className="profile-img-fallback">🦁</div>
            )}
            <button className="edit-icon-btn" onClick={handleClickEditIcon}>
              ✎
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
          </div>
          <h2 className="nickname-display">Likelion#1253</h2>
        </div>
        <button className="save-btn">프로필 저장</button>
      </div>

      {/* 프로필 하단: 입력창 영역 */}
      <div className="input-section">
        <div className="input-group">
          <label>한 줄 소개</label>
          <input type="text" placeholder="안녕하세요" />
        </div>
        <div className="input-group">
          <label>좋아하는 노래</label>
          <div className="song-input-wrapper">
            <input type="text" placeholder="🎵 내꺼하자 - 인피니트" />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;