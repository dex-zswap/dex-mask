import Tooltip from '@c/ui/tooltip'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
const positionArrowClassMap = {
  top: 'info-tooltip__top-tooltip-arrow',
  bottom: 'info-tooltip__bottom-tooltip-arrow',
  left: 'info-tooltip__left-tooltip-arrow',
  right: 'info-tooltip__right-tooltip-arrow',
}
export default function InfoTooltip({
  contentText = '',
  position = '',
  containerClassName,
  wrapperClassName,
  wide,
  iconFillColor = '#b8b8b8',
}) {
  return (
    <div className='info-tooltip'>
      <Tooltip
        interactive
        position={position}
        containerClassName={classnames(
          'info-tooltip__tooltip-container',
          containerClassName,
        )}
        wrapperClassName={wrapperClassName}
        tooltipInnerClassName='info-tooltip__tooltip-content'
        tooltipArrowClassName={positionArrowClassMap[position]}
        html={contentText}
        theme={wide ? 'tippy-tooltip-wideInfo' : 'tippy-tooltip-info'}
      >
        <div>
          <img width='12px' src='images/settings/info.png' />
        </div>
      </Tooltip>
    </div>
  )
}
InfoTooltip.propTypes = {
  contentText: PropTypes.node,
  position: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
  wide: PropTypes.bool,
  containerClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
  iconFillColor: PropTypes.string,
}
