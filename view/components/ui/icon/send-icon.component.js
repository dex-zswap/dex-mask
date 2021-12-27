import React from 'react'
import PropTypes from 'prop-types'

const Send = ({ className, size, color }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox='0 0 48 48'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='发送' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <circle
        id='椭圆形'
        stroke={color}
        strokeWidth='2'
        cx='24'
        cy='24'
        r='23'
      ></circle>
      <path
        d='M29.8571429,17 C30.9868162,17 31.9123198,17.8741548 31.9941224,18.9829332 L32,19.1428571 L32,28.7857143 C32,29.3774479 31.5203051,29.8571429 30.9285714,29.8571429 C30.3791045,29.8571429 29.9262423,29.4435284 29.8643511,28.9106655 L29.8571429,28.7857143 L29.857,20.704 L18.8861196,31.676393 C18.4854634,32.0770493 17.8536524,32.1056676 17.419974,31.7622479 L17.323607,31.676393 C16.892131,31.2449171 16.892131,30.5453563 17.323607,30.1138804 L17.323607,30.1138804 L28.295,19.142 L20.2142857,19.1428571 C19.6225521,19.1428571 19.1428571,18.6631622 19.1428571,18.0714286 C19.1428571,17.5219616 19.5564716,17.0690995 20.0893345,17.0072083 L20.2142857,17 L29.8571429,17 Z'
        id='形状结合'
        fill={color}
        fillRule='nonzero'
      ></path>
    </g>
  </svg>
)

Send.defaultProps = {
  className: undefined,
}
Send.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}
export default Send
