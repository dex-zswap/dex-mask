import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

const BackBar = ({ title, url, method = 'push' }) => {
  const history = useHistory();

  const back = useCallback(() => {
    if (url) {
      history[method](url);
    } else {
      history.go(-1);
    }
  }, [history, url]);

  return (
    <div className="back-bar-wrap base-width">
      <div className="back-bar-icon-wrap" onClick={back}>
        <img width="8px" src="images/icons/arrow-down.png" />
      </div>
      <div className="back-bar-title">{title}</div>
    </div>
  );
};

export default BackBar;
