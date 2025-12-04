# Trading Expectancy Calculator

A modern, responsive web application for traders to calculate and visualize their trading expectancy, risk, and potential returns. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Calculations**: Instantly see how changes in win rate, risk, and reward-to-risk ratio affect your edge.
- **Comprehensive Metrics**:
  - Expectancy per Trade (in R-multiples and percentage)
  - Win/Loss Analysis
  - Linear Expectation (Monthly & Yearly)
- **Interactive Inputs**:
  - Adjustable Account Size
  - Win Rate Slider
  - Risk per Trade
  - Reward-to-Risk Ratio
  - Trade Frequency (Daily or Monthly)
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **Dark Mode UI**: Sleek, dark-themed interface designed for traders.

## Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd Trading_Expectancy_Calculator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173` (or the URL shown in your terminal).

## Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be in the `dist` directory.

## Project Structure

```
src/
├── components/        # React components (Header, InputPanel, ResultsPanel)
├── utils/            # Calculation logic and formatting helpers
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
├── index.css         # Global styles and Tailwind imports
└── main.tsx          # Application entry point
```

## License

[MIT](LICENSE)
