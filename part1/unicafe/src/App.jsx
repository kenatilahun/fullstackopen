import { useState } from "react";

const Button = ({ onClick, label }) => (
  <button onClick={onClick}>{label}</button>
);

const StatisticLine = ({ label, value }) => (
  <tr>
    <td>{label}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;

  if (total === 0) {
    return <p>No feedback given</p>;
  }

  const average = ((good - bad) / total).toFixed(1);
  const positivePercent = ((good / total) * 100).toFixed(1) + " %";

  return (
    <table>
      <tbody>
        <StatisticLine label="Good" value={good} />
        <StatisticLine label="Neutral" value={neutral} />
        <StatisticLine label="Bad" value={bad} />
        <StatisticLine label="All" value={total} />
        <StatisticLine label="Average" value={average} />
        <StatisticLine label="Positive" value={positivePercent} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={() => setGood(good + 1)} label="Good" />
      <Button onClick={() => setNeutral(neutral + 1)} label="Neutral" />
      <Button onClick={() => setBad(bad + 1)} label="Bad" />

      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
