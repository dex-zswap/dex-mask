import Loading from '@c/ui/loading-screen';
import { DEFAULT_ROUTE } from '@view/helpers/constants/routes';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class Lock extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    isUnlocked: PropTypes.bool,
    lockDexmask: PropTypes.func,
  };

  componentDidMount() {
    const { lockDexmask, isUnlocked, history } = this.props;

    if (isUnlocked) {
      lockDexmask().then(() => history.push(DEFAULT_ROUTE));
    } else {
      history.replace(DEFAULT_ROUTE);
    }
  }

  render() {
    return <Loading />;
  }
}
