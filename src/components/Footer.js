import "../styles/Footer.css";
import logo from "../assets/img/logo.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* 상단: 로고 + 서비스 소개 */}
        <div className="footer-top">
          <div className="footer-brand">
            <img
              src={logo}
              alt="LTE 로고"
              className="footer-logo"
            />
            <span className="footer-title">Lion To-do Everyday</span>
          </div>

          <p className="footer-desc">
            LTE는 한국항공대학교 멋쟁이사자처럼에서 개발한 투두 관리 기반의 웹
            서비스입니다.
          </p>
        </div>

        {/* 하단: 정보 라인들 */}
        <div className="footer-info">
          <div className="footer-line">
            <span className="footer-pair">
                <span className="footer-label">상호명</span>
                <span className="footer-value">한국항공대학교 멋쟁이사자처럼</span>
            </span>

            <span className="footer-pair">
                <span className="footer-label">대표자</span>
                <span className="footer-value">전유안</span>
            </span>

            <span className="footer-pair">
                <span className="footer-label">주소</span>
                <span className="footer-value footer-value-long">
                경기도 고양시 항공대학로76 항공우주센터 3층 창업카페
                </span>
            </span>
          </div>
          <div className="footer-line">
            <span className="footer-pair">
                <span className="footer-label">사업자등록번호</span>
                <span className="footer-value">333-22-55555</span>
            </span>

            <span className="footer-pair">
                <span className="footer-label">개인정보보호책임자</span>
                <span className="footer-value">전유안</span>
            </span>

            <span className="footer-pair">
                <span className="footer-label">이메일</span>
                <span className="footer-value">kimyena4930@naver.com</span>
            </span>

            <span className="footer-pair">
                <span className="footer-label">전화번호</span>
                <span className="footer-value">010-4276-4930</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
