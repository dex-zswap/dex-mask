import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ReactToggleButton from 'react-toggle-button';
const trackStyle = {
  width: '40px',
  height: '24px',
  padding: '0px',
  borderRadius: '26px',
  border: '2px solid #651AB5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
const offTrackStyle = { ...trackStyle,
  border: '2px solid #8E8E8E'
};
const thumbStyle = {
  width: '18px',
  height: '18px',
  display: 'flex',
  boxShadow: 'none',
  alignSelf: 'center',
  borderRadius: '50%',
  position: 'relative'
};
const colors = {
  activeThumb: {
    base: '#651AB5'
  },
  inactiveThumb: {
    base: '#037DD6',
    base: '#651AB5'
  },
  active: {
    base: '#101422',
    hover: '#101422'
  },
  inactive: {
    base: '#101422',
    hover: '#101422'
  }
};

const ToggleButton = props => {
  const {
    value,
    onToggle,
    offLabel,
    onLabel,
    disabled,
    className
  } = props;
  const modifier = value ? 'on' : 'off';
  return <div className={classnames('toggle-button', `toggle-button--${modifier}`, {
    'toggle-button--disabled': disabled
  }, className)}>
      <ReactToggleButton value={value} onToggle={disabled ? undefined : onToggle} activeLabel="" inactiveLabel="" trackStyle={value ? trackStyle : offTrackStyle} thumbStyle={thumbStyle} thumbAnimateRange={[3, 18]} colors={colors} />
      <div className="toggle-button__status">
        <span className="toggle-button__label-off">{offLabel}</span>
        <span className="toggle-button__label-on">{onLabel}</span>
      </div>
    </div>;
};

ToggleButton.propTypes = {
  value: PropTypes.bool,
  onToggle: PropTypes.func,
  offLabel: PropTypes.string,
  onLabel: PropTypes.string,
  disabled: PropTypes.bool
};
export default ToggleButton;