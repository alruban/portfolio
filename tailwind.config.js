/** @type {import('tailwindcss').Config} */
const core = {
  theme: {
    screens: {
      "max-xs": { max: "413px" },
      xs: "414px",
      "max-sm": { max: "639px" },
      sm: "640px",
      "max-md": { max: "767px" },
      md: "768px",
      "max-xmd": { max: "819px" },
      xmd: "820px",
      "max-lg": { max: "1023px" },
      lg: "1024px",
      "max-xl": { max: "1279px" },
      xl: "1280px",
      "max-2xl": { max: "1439px" },
      "2xl": "1440px",
      "max-3xl": { max: "1679px" },
      "3xl": "1680px",
    },
    border: {
      light: "#EEE"
    },
    colors: {
      primary: "var(--color-primary)",
      background: "var(--color-background)",
      overlay: "rgba(27, 35, 27, 0.5)",
      border: {
        light: "#EEE"
      },
      black: "#090909",
      white: "#FFF",
      grey: {
        50: "#EEE",
        100: "#F8F8F8"
      },
      yellow: {
        50: "#FFF9E6",
        100: "#FFF3CE",
        200: "#FFE79D",
        300: "#FFDB6B",
        400: "#FFCF3A",
        500: "#FFC309",
        600: "#CC9C07",
        700: "#997505",
        800: "#664E04",
        900: "#332702",
      },
      red: {
        50: "#FDECE7",
        100: "#FCD9D0",
        200: "#F9B3A0",
        300: "#F58E71",
        400: "#F26841",
        500: "#EF4212",
        600: "#BF350E",
        700: "#8F280B",
        800: "#601A07",
        900: "#300D04",
      },
      bluepurple: {
        50: "#EBE6F7",
        100: "#D8CCF9",
        200: "#B099F3",
        300: "#8966EC",
        400: "#6133E6",
        500: "#3A00E0",
        600: "#2E00B3",
        700: "#230086",
        800: "#17005A",
        900: "#0C002D",
      },
      navy: {
        50: "#E8EAEF",
        100: "#D2D6E0",
        200: "#A5ADC0",
        300: "#7783A1",
        400: "#4A5A81",
        500: "#1D3162",
        600: "#17274E",
        700: "#0C1427",
        800: "#0C1427",
        900: "#060A14",
      },
      lightpurple: {
        50: "#F7F3FF",
        100: "#EFE7FF",
        200: "#E0CFFF",
        300: "#D0B8FF",
        400: "#C1A0FF",
        500: "#B188FF",
        600: "#8E6DCC",
        700: "#6A5299",
        800: "#473666",
        900: "#231B33",
      },
      green: {
        50: "#E8EBE9",
        100: "#D1D8D4",
        200: "#A4B1A9",
        300: "#76897D",
        400: "#496252",
        500: "#1B3B27",
        600: "#162F1F",
        700: "#102317",
        800: "#0B1810",
        900: "#050C08",
      },
      cyanblue: {
        50: "#E6F6FA",
        100: "#CDECF4",
        200: "#9BDAE9",
        300: "#68C7DF",
        400: "#36B5D4",
        500: "#04A2C9",
        600: "#0382A1",
        700: "#026179",
        800: "#024150",
        900: "#012028",
      },
      orange: {
        50: "#FFEDE6",
        100: "#FFE3D2",
        200: "#FFC7A4",
        300: "#FFAB77",
        400: "#FF8F49",
        500: "#FF731C",
        600: "#CC5C16",
        700: "#994511",
        800: "#662E0B",
        900: "#331706",
      },
      purple: {
        50: "#F0EBFC",
        100: "#E0D7F9",
        200: "#C2AFF3",
        300: "#A387ED",
        400: "#855FE7",
        500: "#6637E1",
        600: "#522CB4",
        700: "#3D2187",
        800: "#29165A",
        900: "#140B2D",
      },
      buttons: {
        disabled: {
          background: "#FAFAFA",
          text: "#868586",
        },
      },
    },
    fontFamily: {
      body: ["var(--font-primary)", "sans-serif"],
      heading: ["var(--font-secondary)", "sans-serif"],
    },
    fontSize: {
      "3xs": "1rem",
      "2xs": "1.1rem",
      xs: "1.3rem",
      sm: "1.2rem",
      md: "1.4rem",
      base: "1.6rem",
      lg: "1.8rem",
      xl: "2rem",
      "2xl": "2.4rem",
      "3xl": "2.8rem",
      "4xl": "3.2rem",
      "5xl": "3.6rem",
      "6xl": "4rem",
      "7xl": "4.8rem",
      "8xl": "6.4rem",
      "9xl": "7.2rem",
    },
    spacing: {
      px: "1px",
      rem: "1rem",
      0: "0px",
      1: "0.4rem",
      2: "0.8rem",
      3: "1.2rem",
      4: "1.6rem",
      5: "2rem",
      6: "2.4rem",
      7: "2.8rem",
      8: "3.2rem",
      9: "3.6rem",
      10: "4rem",
      11: "4.4rem",
      12: "4.8rem",
      13: "5.6rem",
      14: "6.4rem",
      15: "7.2rem",
      16: "8rem",
      17: "9.6rem",
      18: "11.2rem",
      19: "12.8rem",
      20: "25.6rem",
      space: "var(--row-space)",
    },
    aspectRatio: {
      auto: "auto",
      square: "1 / 1",
    },
    transition: {
      fastest: "0.25s ease-in-out",
      faster: "0.5s ease-in-out",
      fast: "0.75s ease-in-out",
    },
    lineHeight: {
      none: 1,
      1: 1.1,
      normal: 1.5,
    },
    letterSpacing: {
      0: "0px",
      1: "0.01em",
      2: "0.02em",
    },
    extend: {
      aspectRatio: {
        'screen': '21 / 10',
      },
      gridTemplateRows: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        '19': 'repeat(19, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '21': 'repeat(21, minmax(0, 1fr))',
        '22': 'repeat(22, minmax(0, 1fr))',
        '23': 'repeat(23, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        '19': 'repeat(19, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '21': 'repeat(21, minmax(0, 1fr))',
        '22': 'repeat(22, minmax(0, 1fr))',
        '23': 'repeat(23, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
      },
      gridRow: {
        'span-7': 'span 7 / span 7',
        'span-8': 'span 8 / span 8',
        'span-9': 'span 9 / span 9',
        'span-10': 'span 10 / span 10',
        'span-11': 'span 11 / span 11',
        'span-12': 'span 12 / span 12',
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
      },
      zIndex: {
        1: 1
      },
      keyframes: {
        "fade-in": {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        "fade-in": 'fade-in 1s ease-in-out',
      }
    }
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  presets: [core],
};
