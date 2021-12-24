import React from 'react'
import PropTypes from 'prop-types'

const Spinner = ({ className = '', color = '#000000' }) => {
  return (
    <div className={`spinner ${className}`}>
      <div className='cssload-bell'>
        <div className='cssload-circle'>
          <div className='cssload-inner'></div>
        </div>
        <div className='cssload-circle'>
          <div className='cssload-inner'></div>
        </div>
        <div className='cssload-circle'>
          <div className='cssload-inner'></div>
        </div>
        <div className='cssload-circle'>
          <div className='cssload-inner'></div>
        </div>
        <div className='cssload-circle'>
          <div className='cssload-inner'></div>
        </div>
      </div>
    </div>
  )
}

Spinner.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
}
export default Spinner
