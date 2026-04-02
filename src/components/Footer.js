import "../styles/Footer.css";
import logo from "../assets/img/logo.png";

function Footer() {
  return (
    <footer className="footer">
        {/* 상단: 로고 및 타이틀 */}
        <div className="footer-top">
            <img src={logo} alt="LTE 로고" className="footer-logo" />
            <span className="footer-title-text">Lion To-do Everyday</span>
        </div>

        {/* 중단: 서비스 설명 */}
        <div className="footer-mid">
            <span className="footer-description">
                LTE는 한국항공대학교 멋쟁이사자처럼에서 개발한 투두 관리 기반의 웹 서비스입니다.
            </span>
        </div>

        {/* 하단: 상세 정보 (Grid 레이아웃 활용) */}
        <div className="footer-bottom">
            <div className="info-item">
                <span className="label">상호명</span>
                <span className="value">한국항공대학교 멋쟁이사자처럼</span>
            </div>

            <div className="info-item">
                <span className="label">대표자</span>
                <span className="value">전유안</span>
            </div>

            <div className="info-item">
                <span className="label">주소</span>
                <span className="value">경기도 고양시 항공대학로76 항공우주센터 3층 창업카페</span>
            </div>

            <div className="info-item">
                <span className="label">사업자등록번호</span>
                <span className="value">333-22-55555</span>
            </div>

            <div className="info-item">
                <span className="label">개인정보보호책임자</span>
                <span className="value">전유안</span>
            </div>

            <div className="info-item">
                <span className="label">이메일</span>
                <span className="value">kimyena4930@naver.com</span>
            </div>

            <div className="info-item">
                <span className="label">전화번호</span>
                <span className="value">010-4276-4930</span>
            </div>
        </div>
    </footer>
  );
}

export default Footer;