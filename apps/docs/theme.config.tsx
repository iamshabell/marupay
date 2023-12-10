import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>MaruPay</span>,
  project: {
    link: 'https://github.com/iamshabell/marupay',
  },
  docsRepositoryBase: 'https://github.com/iamshabell//marupay',
  footer: {
    text: 'MaruPay Docs',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="MaruPay" />
      <meta property="og:description" content="Unifying Payments for Developers" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@marupaysdk" />
      <meta name="twitter:title" content="MaruPay" />
      <meta name="twitter:description" content="Unifying Payment for Developers" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s – MaruPay'
    }
  },
}

export default config
