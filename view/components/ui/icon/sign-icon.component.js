import React from 'react'
import PropTypes from 'prop-types'
export default function Sign({ className, size, color }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g id='签名' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <circle
          id='椭圆形'
          stroke={color}
          strokeWidth='2'
          cx='24'
          cy='24'
          r='23'
        ></circle>
        <path
          d='M31.7781746,31.3994949 C32.3304593,31.3994949 32.7781746,31.8472102 32.7781746,32.3994949 C32.7781746,32.9517797 32.3304593,33.3994949 31.7781746,33.3994949 L23.7781746,33.3994949 C23.2258898,33.3994949 22.7781746,32.9517797 22.7781746,32.3994949 C22.7781746,31.8472102 23.2258898,31.3994949 23.7781746,31.3994949 L31.7781746,31.3994949 Z M32.1776695,15.7071068 C33.3492424,16.8786797 33.3492424,18.7781746 32.1776695,19.9497475 L19.0355339,33.0918831 C18.8479975,33.2794195 18.5936436,33.3847763 18.3284271,33.3847763 L15.5,33.3847763 C14.9477153,33.3847763 14.5,32.9370611 14.5,32.3847763 L14.5,29.5563492 C14.5,29.2911327 14.6053568,29.0367788 14.7928932,28.8492424 L27.9350288,15.7071068 C29.1066017,14.5355339 31.0060967,14.5355339 32.1776695,15.7071068 Z M22.2781746,24.1923882 L16.499698,29.9708648 L16.5004051,31.3843712 L17.9146186,31.3843712 L23.6923882,25.6066017 L22.2781746,24.1923882 Z M29.4364632,17.043614 L29.3492424,17.1213203 L23.6923882,22.7781746 L25.1066017,24.1923882 L30.763456,18.5355339 C31.1260857,18.1729042 31.1519878,17.6010588 30.8411623,17.2085412 L30.763456,17.1213203 C30.4008263,16.7586906 29.8289809,16.7327885 29.4364632,17.043614 Z M26.8743687,14.6464466 C27.0696308,14.8417088 27.0696308,15.1582912 26.8743687,15.3535534 L21.9246212,20.3033009 C21.7293591,20.498563 21.4127766,20.498563 21.2175144,20.3033009 C21.0222523,20.1080387 21.0222523,19.7914562 21.2175144,19.5961941 L26.1672619,14.6464466 C26.362524,14.4511845 26.6791065,14.4511845 26.8743687,14.6464466 Z'
          id='形状结合'
          fill={color}
          fillRule='nonzero'
        ></path>
      </g>
    </svg>
  )
}
Sign.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}
