import React from "react";

import Copyright from "./Footer/Copyright";
import ContactUs from "./Footer/ContactUs";

export default class Footer extends React.Component {
    render () {
        return (
            <footer>
              <div className="footer-wrapper">
                <Copyright />
                <ContactUs />
                <a href="#" title="Frequently asked questions"><span className="icon-envelope">FAQ</span></a>
              </div>
            </footer>
        );
    }
}