import React from 'react';
import PropTypes from 'prop-types';
import { BarLoader, PropagateLoader, ScaleLoader } from 'react-spinners';

const centerLoader = {
  display: "block",
  margin: "0 auto",
  top: "50%",
  left: "50%",
  position: "absolute !important",
  width: "0"
}

const topLoader = {
  display: "block",
  position: "fixed !important",
  left: "0",
  top: "0"
}

class PageLoader extends React.Component {
  static defaultProps = {
    type: 'center',
    loading: true
  }
  render() {
    const { type } = this.props;
    switch (type) {
      case 'bar':
        return <BarLoader
          style={topLoader}
          widthUnit={"%"}
          width={100}
          heightUnit={"px"}
          height={3}
          color={"#1AEEC2"}
          loading={this.props.loading}
        />;
      case 'position':
        return <ScaleLoader
          sizeUnit='px'
          height={25}
          width={4}
          radius={2}
          color='#1AEEC2'
          loading={this.props.loading}
        />;
      default:
        return <PropagateLoader
          style={centerLoader}
          sizeUnit={"px"}
          size={15}
          color={"#1AEEC2"}
          loading={this.props.loading}
        />;
    }
  }
}

PageLoader.propTypes = {
  type: PropTypes.string,
  loading: PropTypes.bool,
};

export default PageLoader;
