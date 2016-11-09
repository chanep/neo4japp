import React from "react";

import { hashHistory, Link, browserHistory, withRouter } from "react-router";

class RelatedEmployee extends React.Component {

    constructor(){
        super();

        this.state = {
            data: [],
            index: 0,
            currentUser: null,
            similar: false,
            multiple: false
        };

        this.goToPrev = this.goToPrev.bind(this);
        this.goToNext = this.goToNext.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            currentUser: newProps.user,
            data: (newProps.similarSkilledUsers !== undefined ? newProps.similarSkilledUsers : null),
            similar: (newProps.similar !== undefined ? newProps.similar : null),
            multiple: (newProps.multiple !== undefined ? newProps.multiple : null)
        });
    }

    componentDidMount() {
        this.setState({
            currentUser: this.props.user,
            data: (this.props.similarSkilledUsers !== undefined ? this.props.similarSkilledUsers : null),
            similar: (this.props.similar !== undefined ? this.props.similar : false),
            multiple: (this.props.multiple !== undefined ? this.props.multiple : false)
        });
    }

    goToPrev() {
        var index = this.state.index;

        if (index - 1 >= 0)
            index--;
        else
            index = this.state.data.length - 1;

        this.setState({ index: index });
    }

    goToNext() {
        var index = this.state.index;

        if (index + 1 < this.state.data.length)
            index++;
        else
            index = 0;

        this.setState({ index: index });
    }

    goTo(self, userId) {
        var path = '/employee/' + self;
        this.context.router.push({ pathname: path });
    }

    render() {
        if (this.state.currentUser === undefined || this.state.currentUser === null)
            return null;

        let self = this;

        var user = this.state.currentUser;

        //if (this.state.data != undefined) {
        //    user = this.state.data[this.state.index];
        //}

        if (user.image === undefined || user.image === null)
            user.image = "/img/img_noPortrait.gif";

        var emailSnippet = 'mailto:' + user.email;

    	return (
    		<div className="related-employee">
    			<div className="header">{user.section}</div>
    			<div className="employeeData">
    				<div className="picture"><img src={user.image} /></div>
    				<div className="nameData" onClick={self.goTo.bind(this, user.id)}>
    					<div className="name">{user.name}</div>
    					<div className="position">{user.position}</div>
    					<div className="area">{user.department}</div>
    				</div>
                    {this.state.similar && this.state.multiple ?
    				    <div className="arrows"><span className="ss-icon-right-arrow arrow-prev" title="Go to previous" onClick={this.goToPrev}></span> <span className="ss-icon-right-arrow arrow-next" title="Go to next" onClick={this.goToNext}></span></div>
                    : false}
                    {!this.state.similar ?
                        <a className="mail" href={emailSnippet}><span className="ss-icon-envelope related-email"></span></a>
                    : false}
    			</div>
    		</div>
    	);
    }

}

RelatedEmployee.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default RelatedEmployee;