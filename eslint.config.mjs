import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const config = [
  {
    ignores: [
      '.agents/**',
      '.claude/**',
      '.next/**',
      'node_modules/**',
      'scripts/**',
    ],
  },
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]

export default config
