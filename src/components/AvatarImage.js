import React, { useEffect, useState } from "react";

// S3 이미지가 403/404 등으로 로드되지 않으면 fallback 을 대신 보여줍니다.
const AvatarImage = ({ src, alt = "", fallback = null, ...imgProps }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return fallback;

  return <img src={src} alt={alt} onError={() => setFailed(true)} {...imgProps} />;
};

export default AvatarImage;
