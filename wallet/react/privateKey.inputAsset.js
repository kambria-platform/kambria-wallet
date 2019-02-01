import React, { Component } from 'react';

class PrivateKeyAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      asset: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ asset: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.returnData2Parent();
  }

  returnData2Parent() {
    return this.props.done({
      subType: 'private-key',
      asset: this.state.asset
    });
  }

  render() {
    if (!this.props.visible) return null;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label> PrivateKeyAsset
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default PrivateKeyAsset;