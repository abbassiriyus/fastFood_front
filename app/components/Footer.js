import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <p>&copy; 2025 Sizning Kompaniya Nomingiz. Barcha huquqlar himoyalangan.</p>
                    <ul className="footer-links">
                        <li><a href="#about">Biz Haqimizda</a></li>
                        <li><a href="#services">Xizmatlar</a></li>
                        <li><a href="#contact">Aloqa</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;