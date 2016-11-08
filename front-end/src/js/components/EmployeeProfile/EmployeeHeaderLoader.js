import React from "react";

export default class EmployeeHeaderLoader extends React.Component {

	render() {
		return (
			<div className="employee-header-container">
				<div className="item-loader-wrapper employee-loader">
					<div className="item-loader">
						<div className="animated-background">
							<div className="background-masker photoend-space"></div>
							<div className="background-masker photoend-bottom"></div>
							<div className="background-masker name-top"></div>
							<div className="background-masker name-end"></div>
							<div className="background-masker name-bottom"></div>
							<div className="background-masker position-end"></div>
							<div className="background-masker position-bottom"></div>
							<div className="background-masker office-end"></div>
							<div className="background-masker office-bottom"></div>
							<div className="background-masker manager-end"></div>
							<div className="background-masker manager-bottom"></div>
							<div className="background-masker interests-end"></div>
							<div className="background-masker interests-bottom"></div>
							<div className="background-masker industries-end"></div>
							<div className="background-masker industries-bottom"></div>
							<div className="background-masker clients-end"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}