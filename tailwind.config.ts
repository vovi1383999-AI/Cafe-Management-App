import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        espresso: '#3B2F2F',
        crema: '#F8E8D0'
      }
    }
  },
  plugins: []
} satisfies Config;
