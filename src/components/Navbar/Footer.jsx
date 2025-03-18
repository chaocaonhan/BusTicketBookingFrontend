import React from 'react';
import heroBg from '../../assets/footer.png'; // Điều chỉnh đường dẫn

const Footer = () => {
  return (
    <div className="footer">
      <img src={heroBg} alt="Footer" className="footer-image" />
    </div>
  );
};

export default Footer;
