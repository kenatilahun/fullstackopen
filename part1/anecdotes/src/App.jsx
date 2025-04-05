import { useState } from 'react';
import Statistics from './components/Statistics';
import Button from './components/Button';
import Anecdote from './components/Anecdote';

const App = () => {
  // Unicafe feedback states
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  // Anecdote states
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const handleVote = (index) => {
    const copy = [...votes];
    copy[index] += 1;
    setVotes(copy);
  };

  const getMaxVotes = () => {
    const max = Math.max(...votes);
    return votes.indexOf(max);
  };

  // Unicafe: Increment feedback count
  const handleGood = () => setGood(good + 1);
  const handleNeutral = () => setNeutral(neutral + 1);
  const handleBad = () => setBad(bad + 1);

  return (
    <div>
      <h1>Unicafe Feedback</h1>
      <Button text="Good" onClick={handleGood} />
      <Button text="Neutral" onClick={handleNeutral} />
      <Button text="Bad" onClick={handleBad} />
      
      <Statistics good={good} neutral={neutral} bad={bad} />

      <h1>Anecdotes</h1>
      <Anecdote anecdote={anecdotes[selected]} />
      <Button text="Next Anecdote" onClick={() => setSelected(Math.floor(Math.random() * anecdotes.length))} />
      <Button text="Vote" onClick={() => handleVote(selected)} />

      <h2>Anecdote with most votes</h2>
      <Anecdote anecdote={anecdotes[getMaxVotes()]} />
      <p>Votes: {votes[getMaxVotes()]}</p>
    </div>
  );
};

export default App;
