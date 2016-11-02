/**
 * Pages: FAQ
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';

// Class: FAQ
export default class FAQ extends React.Component {
    render() {
        return (
            <div>
                <Header search={false} loggedIn={false} />
                <div className="faq">
                    <h3>Frequently Asked Questions</h3>
                    <div className="faq-content">
                        <article className="faq-entry">
                            <h4 className="faq-entry-title"><span></span>What is SkillSearch?</h4>
                            <div className="faq-entry-content"><p>R/GA is full of the most talented people in the industry and this site will help identify all the skills that we possess. With skills as part of your R/GA profile, managers can better steer you along your career. It also allows Resource Managers to match you with the right projects and identify opportunities for you to learn and improve existing skills.</p></div>
                        </article>
                        <article className="faq-entry">
                            <h4 className="faq-entry-title"><span></span>How do I get a SkillSearch Profile?</h4>
                            <div className="faq-entry-content"><p>You already have one! You have to be on a R/GA servers to access the platform. The site url is: <a href="http://skillsearch/">http://skillsearch/</a>. Use your R/GA username and password to log in.</p></div>
                        </article>
                        <article className="faq-entry">
                            <h4 className="faq-entry-title"><span></span>Do I have to do this?</h4>
                            <div className="faq-entry-content"><p>Yes, for several reasons. Your skill profile will be used during review cycles to make sure you are on track for your career goals. It also allows Resource Managers and your department to allocate you on projects that fit your existing skills or skills you want to expand upon. Lastly it allows you to identify skills that you may not utilize in your day to day work but are very beneficial for existing and upcoming projects.</p></div>
                        </article>
                        <article className="faq-entry">
                            <h4 className="faq-entry-title"><span></span>What do the skill levels mean?</h4>
                            <div className="faq-entry-content"><p><strong>Heavy Supervision:</strong> You have very little experience and would need someone with that skill managing your role throughout the project.</p>
                            <p><strong>Light Supervision:</strong> You have minimal experience and possibly done the skill with assistance but would need someone overseeing your progress during the project.</p>
                            <p><strong>No Supervision:</strong> You have done this skill many times before and confidant in your capabilities.</p>
                            <p><strong>Teach/Manage:</strong> You are considered an expert and can adequately explain the skills to someone inexperienced or conduct an R/GAU seminar.Want? This is skill you would like to learn, and coincides with your career path at R/GA.</p></div>
                        </article>
                        <article className="faq-entry">
                            <h4 className="faq-entry-title"><span></span>Who sees my skills?</h4>
                            <div className="faq-entry-content"><p>Only your direct manager and resource managers have access to view your skill profile. Also your department heads and R/GA leadership can view and search skills.</p></div>
                         </article>
                         <article className="faq-entry">
                            <h4 className="faq-entry-title"><span></span>In the menu, what is “Your work?”</h4>
                            <div className="faq-entry-content"><p>This link goes to your Square work page. Square is our portfolio platform that is currently in development. At this time, Square only supports Visual Design, XD, and Copy portfolio pages. If there is a specific project that highlights one of your skills, Square is the place to highlight that.</p></div>
                        </article>
                        <article className="faq-entry">
                            <h4 className="faq-entry-title"><span></span>What’s Next?</h4>
                            <div className="faq-entry-content"><p>Skillsearch is an evolving platform and new things will be introduced over phases. We are very excited on what this platform can do and will be capable of in the future. In short Skillsearch will help everyone achieve their highest potential and foster growth.</p></div>
                        </article>
                        <article className="faq-entry">
                            <h4 className="faq-entry-title"><span></span>I still have a question.</h4>
                            <div className="faq-entry-content"><p>Any Questions, Concerns, Problems, email <a href="mailto:skillsearch@rga.com">skillsearch@rga.com</a></p></div>
                        </article>
                    </div>
                </div>
            </div>
        );
    }
}
