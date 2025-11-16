import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";
import fallbackLogo from "../assets/logo.jpg";

export default function Footer() {
  return (
    <footer className="faculty-footer">
      <div className="container">
        <div className="col brand-col">
          <img
            src="/brand/university logo.png"
            alt="University logo"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackLogo }}
          />
          <div className="brand-text">
            <h3>Faculty of Computing</h3>
            <p>University of Sri Jayewardenepura — Attendance Tracking Portal</p>
          </div>
        </div>

        <div className="col links-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="col contact-col">
          <h4>Contact</h4>
          <address>
            Faculty of Computing<br />
            University of Sri Jayewardenepura<br />
            Nugegoda, Sri Lanka<br />
            <a href="mailto:info@foc.sjp.ac.lk">info@foc.sjp.ac.lk</a>
          </address>
        </div>
      </div>

      <div className="legal">
        <div>© {new Date().getFullYear()} Faculty of Computing — University of Sri Jayewardenepura</div>
        <div className="socials">
          <span>All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

