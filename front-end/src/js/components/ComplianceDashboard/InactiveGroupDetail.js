import React from "react";
import { Link } from "react-router";

import GroupDetail from './GroupDetail';

export default class InactiveGroupDetail extends React.Component {
  render () {
    return (
      <GroupDetail data={this.props.data} showActive={false} />
    );
  }
}
