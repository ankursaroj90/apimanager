import React from 'react';
import { FiHeart, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>
            Made with <FiHeart className="heart-icon" /> by API Manager Team
          </p>
          <p className="copyright">
            © {currentYear} API Manager. All rights reserved.
          </p>
        </div>

        <div className="footer-center">
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/docs" className="footer-link">Documentation</a>
            <a href="/support" className="footer-link">Support</a>
          </div>
        </div>

        <div className="footer-right">
          <div className="social-links">
            <a 
              href="https://github.com/ankursaroj90" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
            <a 
              href="https://twitter.com/apimanager" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Twitter"
            >
              <FiTwitter />
            </a>
            <a 
              href="https://www.linkedin.com/in/ankur-saroj-a59a2a260/"
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <FiLinkedin />
            </a>
          </div>
          <div className="version-info">
            v1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;