import React from "react";

export default class DropdownMenu extends React.Component {
	render () {
		return (
			<div className="dropdown-menu" data-align={this.props.align}>
				<div className="dropdown-menu__title">Actions <span className="ss-icon-down-arrow"></span></div>
				<div className="dropdown-menu__list">
					{this.props.items.map((item, index) =>
						<button onClick={item.action} disabled={item.disabled} key={index}>{item.title}</button>
					)}
				</div>
			</div>
		);
	}
}
