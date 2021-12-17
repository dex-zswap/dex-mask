import React from 'react';
import PropTypes from 'prop-types';

const Interaction = ({ className, size, color }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      id="合约交互"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <circle
        id="椭圆形"
        stroke={color}
        strokeWidth="2"
        cx="24"
        cy="24"
        r="23"
      ></circle>
      <path
        d="M15.580156,20.4509541 L15.6457964,20.5128723 L18.034553,23.2081638 C18.1156075,23.2996196 18.1603622,23.4175932 18.1603622,23.539798 C18.1603622,23.7852578 17.983487,23.9894063 17.7502378,24.0317423 L17.6603622,24.039798 L16.2716056,24.039798 C16.2716056,28.4049116 19.8013191,31.9380664 24.1485033,31.9380664 C26.6667253,31.9380664 28.9865051,30.7460022 30.465773,28.7585042 C30.7928047,28.3191146 31.4186999,28.2246592 31.863749,28.5475323 C32.3087981,28.8704054 32.40447,29.4883414 32.0774382,29.927731 C30.2262079,32.414986 27.3117574,33.9126335 24.1485033,33.9126335 C18.690537,33.9126335 14.2716056,29.489394 14.2716056,24.039798 L12.882849,24.039798 C12.7606443,24.039798 12.6426706,23.9950433 12.5512148,23.9139888 C12.3675172,23.751183 12.3320519,23.4834077 12.4550752,23.2807681 L12.5086582,23.2081638 L14.8974148,20.5128723 C14.9107329,20.4978451 14.9249442,20.4836338 14.9399714,20.4703156 C15.1236691,20.3075098 15.3937658,20.3044747 15.580156,20.4509541 Z M23.8514967,14.0873665 C29.309463,14.0873665 33.7283944,18.510606 33.7283944,23.960202 L35.117151,23.960202 C35.2393557,23.960202 35.3573294,24.0049567 35.4487852,24.0860112 C35.6324828,24.248817 35.6679481,24.5165923 35.5449248,24.7192319 L35.4913418,24.7918362 L33.1025852,27.4871277 C33.0892671,27.5021549 33.0750558,27.5163662 33.0600286,27.5296844 C32.8763309,27.6924902 32.6062342,27.6955253 32.419844,27.5490459 L32.3542036,27.4871277 L29.965447,24.7918362 C29.8843925,24.7003804 29.8396378,24.5824068 29.8396378,24.460202 C29.8396378,24.2147422 30.016513,24.0105937 30.2497622,23.9682577 L30.3396378,23.960202 L31.7283944,23.960202 C31.7283944,19.5950884 28.1986809,16.0619336 23.8514967,16.0619336 C21.3332747,16.0619336 19.0134949,17.2539978 17.534227,19.2414958 C17.2071953,19.6808854 16.5813001,19.7753408 16.136251,19.4524677 C15.6912019,19.1295946 15.59553,18.5116586 15.9225618,18.072269 C17.7737921,15.585014 20.6882426,14.0873665 23.8514967,14.0873665 Z"
        id="形状结合"
        fill={color}
        fillRule="nonzero"
      ></path>
    </g>
  </svg>
);

Interaction.defaultProps = {
  className: undefined,
};
Interaction.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};
export default Interaction;
