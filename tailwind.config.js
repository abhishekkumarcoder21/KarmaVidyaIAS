/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5bcfd',
          400: '#8299fb',
          500: '#6674f4',
          600: '#4f52e8',
          700: '#4140cf',
          800: '#3635a8',
          900: '#1e2a5e',
          950: '#131b42',
        },
        saffron: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdc98',
          300: '#ffc258',
          400: '#ffa626',
          500: '#f98b0c',
          600: '#e06b05',
          700: '#ba4f08',
          800: '#963f0e',
          900: '#7a350f',
        },
        slate: {
          750: '#2d3748',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: theme('colors.slate.800'),
            lineHeight: '1.75',
            'h1, h2, h3, h4': {
              fontWeight: '700',
              color: theme('colors.navy.900'),
            },
            a: {
              color: theme('colors.navy.700'),
              textDecoration: 'underline',
            },
            'a:hover': {
              color: theme('colors.navy.900'),
            },
            blockquote: {
              borderLeftColor: theme('colors.saffron.400'),
              color: theme('colors.slate.700'),
            },
          },
        },
      }),
      screens: {
        xs: '360px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
