import React from 'react';
import shellActions from '../actions/shell';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const mapStateToProps = (state) => {
  return state;
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(shellActions, dispatch)
});

export class CoreLayout extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    shell: React.PropTypes.object,
    actions: React.PropTypes.object,
    loader: React.PropTypes.object
  };
  render () {
    return (
      <div className='page-container'>
        <div className={this.props.loader.loading ? 'loader' : 'loader hide'}></div>
        <div className='view-container'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout);
