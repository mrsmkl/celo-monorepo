import * as Sentry from '@sentry/node'
import getConfig from 'next/config'
export function initSentry() {
  const { publicRuntimeConfig } = getConfig()
  console.log(publicRuntimeConfig)
  if (publicRuntimeConfig.ENV === 'development') {
    return
  }
  const config = publicRuntimeConfig.SENTRY
  Sentry.init({
    dsn: `https://${config.KEY}@sentry.io/${config.PROJECT}`,
    environment: publicRuntimeConfig.ENV,
  })
}

export default Sentry
