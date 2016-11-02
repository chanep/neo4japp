import React from "react";

import Copyright from "./Footer/Copyright";
import ContactUs from "./Footer/ContactUs";

import { Link } from "react-router";

export default class Footer extends React.Component {
    render () {
        return (
            <footer>
              <div className="footer-wrapper">
                <Copyright />
                <ContactUs />
                <Link to={"/faq"}><span className="icon-envelope">FAQ</span></Link>
              </div>
            </footer>
        );
    }
}