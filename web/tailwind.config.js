/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Ubuntu', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: {
          lightest: 'var(--primary-lightest)',
          light: 'var(--primary-light)',
          DEFAULT: 'var(--primary-DEFAULT)',
          dark: 'var(--primary-dark)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          light: 'var(--secondary-light)',
          DEFAULT: 'var(--secondary-DEFAULT)',
          dark: 'var(--secondary-dark)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        white: 'var(--white)',
        'white-dark': 'var(--white-dark)',
        'gray-light': 'var(--gray-light)',
        gray: 'var(--gray)',
        'gray-dark': 'var(--gray-dark)',
        'gray-darkest': 'var(--gray-darkest)',

        info: {
          lightest: 'var(--info-lightest)',
          DEFAULT: 'var(--info-DEFAULT)',
          dark: 'var(--info-dark)',
          foreground: 'var(--info-foreground)',
        },
        success: {
          lightest: 'var(--success-lightest)',
          light: 'var(--success-light)',
          DEFAULT: 'var(--success-DEFAULT)',
          dark: 'var(--success-dark)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          lightest: 'var(--alert-lightest)',
          light: 'var(--alert-light)',
          DEFAULT: 'var(--warning-DEFAULT)',
          dark: 'var(--alert-dark)',
          alt: 'var(--alert-alt)',
          'alt-dark': 'var(--alert-alt-dark)',
          foreground: 'var(--warning-foreground)',
        },
        destructive: {
          lightest: 'var(--danger-lightest)',
          DEFAULT: 'var(--destructive)',
          dark: 'var(--danger-dark)',
          foreground: 'var(--destructive-foreground)',
        },
      },
    },
  },
  plugins: [],
}
