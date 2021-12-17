import React from 'react';
import PropTypes from 'prop-types';

const Receive = ({ className, size, color }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="收款" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <circle
        id="椭圆形"
        stroke={color}
        strokeWidth="2"
        cx="24"
        cy="24"
        r="23"
      ></circle>
      <g id="编组" transform="translate(16.000000, 15.000000)" fill={color}>
        <path
          d="M8.05685425,0 C8.609139,-1.01453063e-16 9.05685425,0.44771525 9.05685425,1 L9.056,12.242 L13.0066017,8.29289322 C13.397126,7.90236893 14.030291,7.90236893 14.4208153,8.29289322 C14.783445,8.65552292 14.8093471,9.22736831 14.4985216,9.61988597 L14.4208153,9.70710678 L9.47106781,14.6568542 C8.72552144,15.4024006 7.53780753,15.4362891 6.7520641,14.7585197 L6.64264069,14.6568542 L1.69289322,9.70710678 C1.30236893,9.31658249 1.30236893,8.68341751 1.69289322,8.29289322 C2.05552292,7.93026352 2.62736831,7.9043614 3.01988597,8.21518685 L3.10710678,8.29289322 L7.056,12.242 L7.05685425,1 C7.05685425,0.44771525 7.5045695,1.01453063e-16 8.05685425,0 Z"
          id="形状结合"
          fillRule="nonzero"
        ></path>
        <rect id="矩形" x="0" y="17" width="16" height="2" rx="1"></rect>
      </g>
    </g>
  </svg>
);

Receive.defaultProps = {
  className: undefined,
};
Receive.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};
export default Receive;
