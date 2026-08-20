/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Ndotoni brand green — matches poster vibrant green
        brand: {
          50:  '#EEFBF3',
          100: '#D6F5E3',
          200: '#B0EBCB',
          300: '#7ADEA9',
          400: '#3DCC7E',
          500: '#1DBF53',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        cream: {
          50:  '#FFFFFF',
          100: '#FAFBFC',
          200: '#F3F4F6',
          300: '#E5E7EB',
          400: '#9CA3AF',
        },
        ink: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          300: '#9CA3AF',
          500: '#6B7280',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        clay: {
          500: '#1DBF53',
          700: '#15803D',
        },
        stone: {
          50:  '#FAFBFC',
          100: '#F3F4F6',
          200: '#E5E7EB',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft:       '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        editorial:  '0 4px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03)',
        green:      '0 8px 32px rgba(29,191,83,0.20)',
        'green-sm': '0 2px 12px rgba(29,191,83,0.15)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1DBF53 0%, #16A34A 100%)',
        'brand-radial':   'radial-gradient(circle at 30% 20%, rgba(29,191,83,0.16) 0%, rgba(29,191,83,0) 60%)',
      },
    },
  },
  plugins: [],
}
