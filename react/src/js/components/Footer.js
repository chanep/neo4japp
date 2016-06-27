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
              </div>
            </footer>
        );
    }
}