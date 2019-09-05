'use strict'

import React, { useCallback, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import debounce from 'lodash.debounce'

function LoadMore ({ parentElement, onActivate, ...rest }) {
  const [t] = useTranslation()
  const lastScrollTop = useRef(-1)

  const activate = useCallback(() => {
    if (typeof onActivate === 'function') onActivate()
  }, [onActivate])

  const debouncedActivate = useCallback(debounce(activate, 100, { leading: true }), [activate])

  const onScroll = useCallback(
    event => {
      const element = event.target
      if (!element) return
      if (lastScrollTop.current > 0 && element.scrollTop === 0) {
        debouncedActivate()
      } else if (lastScrollTop.current === 0) {
        debouncedActivate.cancel()
      }
      lastScrollTop.current = event.target.scrollTop
    },
    [debouncedActivate]
  )

  useLayoutEffect(() => {
    if (!parentElement) return
    parentElement.addEventListener('scroll', onScroll)
    return () => {
      debouncedActivate.cancel()
      parentElement.removeEventListener('scroll', onScroll)
    }
  }, [parentElement, onScroll])

  return (
    <div className="firstMessage loadMore" {...rest} onClick={activate}>
      {t('channel.loadMore')}
    </div>
  )
}

LoadMore.propTypes = {
  parentElement: PropTypes.instanceOf(Element),
  onActivate: PropTypes.func
}

export default LoadMore
