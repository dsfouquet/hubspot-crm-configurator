/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // HubSpot brand system (spec Section 9)
        hs: {
          orange: '#FF7A59',
          navy: '#2D3E50',
          blue: '#0091AE',
          canvas: '#F5F8FA',
          border: '#CBD6E2',
          'text-dark': '#33475B',
          'text-light': '#7C98B6',
          white: '#FFFFFF',
          green: '#00BDA5',
          red: '#F2545B',
          purple: '#6A78D1',
        },
      },
      fontFamily: {
        // UI chrome vs. HubSpot-adjacent preview pane
        ui: ['Inter', 'system-ui', 'sans-serif'],
        preview: ['"Lexend Deca"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
