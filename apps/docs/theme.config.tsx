import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>MaruPay</span>,
  project: {
    link: 'https://github.com/marupay',
  },
  docsRepositoryBase: 'https://github.com/marupay',
  footer: {
    text: 'MaruPay Docs',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="MaruPay" />
      <meta property="og:description" content="Unifying Payments for Developers" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s – MaruPay'
    }
  },
}

export default config
