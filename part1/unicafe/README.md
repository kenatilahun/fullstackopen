# Unicafe Feedback Application

This is a simple feedback application built using React that allows users to submit their feedback for a student restaurant (Unicafe) at the University of Helsinki. The application tracks three types of feedback: Good, Neutral, and Bad.

## Features

- Collects feedback in three categories: good, neutral, and bad.
- Displays the total number of feedback for each category.
- Provides statistics like the average score and percentage of positive feedback.

## Technologies Used

- React.js
- Vite (for faster build and hot module replacement)
- JavaScript (ES6+)

## Setup Instructions

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Yarn](https://yarnpkg.com/) (Optional, but recommended for package management)

### Installation

To get started with this application, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/unicafe-feedback-app.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd unicafe-feedback-app
    ```

3. **Install the dependencies**:
    - If you're using `npm`:
      ```bash
      npm install
      ```
    - Or if you're using `yarn`:
      ```bash
      yarn install
      ```

4. **Run the application**:
    - If you're using `npm`:
      ```bash
      npm run dev
      ```
    - Or if you're using `yarn`:
      ```bash
      yarn dev
      ```

5. Open your browser and go to `http://localhost:3000` to see the app in action.

## Features Implemented

### 1.6: Unicafe Step 1

The application allows users to give feedback on their experience with three options:
- **Good**
- **Neutral**
- **Bad**

Each feedback option increases its respective counter and displays the current count for each category.

### 1.7: Unicafe Step 2

The application was expanded to include more statistics:
- **Total number of feedback received**
- **Average score** (Good: 1, Neutral: 0, Bad: -1)
- **Percentage of positive feedback**

### 1.8: Unicafe Step 3

The statistics are now displayed in a separate `Statistics` component, improving the structure and organization of the code.

### 1.9: Unicafe Step 4

The statistics are only shown once feedback has been gathered. If no feedback has been submitted, a message "No feedback given" is displayed.

### 1.10: Unicafe Step 5

The `Button` and `StatisticLine` components were extracted into their own components to improve code organization. Each button now handles its respective feedback type.

### 1.11: Unicafe Step 6

The statistics are displayed in a neat HTML table, making the feedback information more structured and easy to read.

## Project Structure

```plaintext
unicafe-feedback-app/
├── public/
│   ├── index.html   
├── src/
│   ├── App.jsx   
│   └── main.jsx
├── .gitignore
├── README.md
├── vite.config.js
└── package.json
