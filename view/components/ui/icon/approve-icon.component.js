import React from 'react'
import PropTypes from 'prop-types'

const Approve = ({ className, size, color }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox='0 0 48 48'
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='授权' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <path
        d='M24,0 C37.254834,0 48,10.745166 48,24 C48,37.254834 37.254834,48 24,48 C10.745166,48 0,37.254834 0,24 C0,10.745166 10.745166,0 24,0 Z M24,2 C11.8497355,2 2,11.8497355 2,24 C2,36.1502645 11.8497355,46 24,46 C36.1502645,46 46,36.1502645 46,24 C46,11.8497355 36.1502645,2 24,2 Z'
        id='椭圆形'
        fill={color}
        fillRule='nonzero'
      ></path>
      <path
        d='M24.5225903,13.0973331 L32.4209003,15.6313554 C33.2947647,15.9117182 33.861397,16.7396511 33.7946804,17.6386499 L33.1748813,25.9903819 C32.9371533,29.1937425 31.1405815,32.0889307 28.3481036,33.7687682 C25.6191193,35.4104106 22.1808807,35.4104106 19.4518964,33.7687682 C16.6594185,32.0889307 14.8628467,29.1937425 14.6251187,25.9903819 L14.0053196,17.6386499 C13.938603,16.7396511 14.5052353,15.9117182 15.3790997,15.6313554 L23.2774097,13.0973331 C23.681914,12.9675556 24.118086,12.9675556 24.5225903,13.0973331 Z M31.79831,17.4962701 L23.9,14.9622478 L16.00169,17.4962701 L16.6214892,25.8480021 C16.8124536,28.4212287 18.2556213,30.7469036 20.49879,32.0962997 C22.585488,33.3515697 25.214512,33.3515697 27.30121,32.0962997 C29.4612984,30.7968812 30.8795477,28.5921617 31.1521624,26.1328604 L31.1785108,25.8480021 L31.79831,17.4962701 Z'
        id='矩形'
        fill={color}
        fillRule='nonzero'
      ></path>
      <path
        d='M19.2814426,22.9731459 C18.9329899,23.3274637 18.9081004,23.8862016 19.2067742,24.2697222 L19.2814426,24.3549438 L21.3198303,26.4276406 C22.0362296,27.156098 23.1775101,27.1892097 23.932535,26.5269757 L24.0376805,26.4276406 L28.7185574,21.6679776 C29.0938142,21.2864046 29.0938142,20.6677526 28.7185574,20.2861797 C28.3701046,19.931862 27.8206154,19.9065536 27.4434432,20.2102545 L27.3596323,20.2861797 L22.6787554,25.0458427 L20.6403677,22.9731459 C20.2651109,22.591573 19.6566994,22.591573 19.2814426,22.9731459 Z'
        id='路径'
        fill={color}
        fillRule='nonzero'
      ></path>
    </g>
  </svg>
)

Approve.defaultProps = {
  className: undefined,
}
Approve.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}
export default Approve
