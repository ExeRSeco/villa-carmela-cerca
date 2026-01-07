/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                spa: {
                    50: '#f7fcfc',
                    100: '#effbfb',
                    200: '#dcf5f5',
                    300: '#beebeb',
                    400: '#9ddcdc',
                    500: '#7bc7c7',
                    600: '#5da7a7',
                    700: '#4a8585',
                    800: '#3f6a6a',
                    900: '#365656',
                    950: '#1f3535',
                },
                stone: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    800: '#292524',
                }

            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                headings: ['Playfair Display', 'serif'],
            },
            keyframes: {
                'fade-in-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
            }
        },
    },
    plugins: [],
}
