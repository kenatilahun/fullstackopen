import React, { useState } from 'react';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays.',
    'The only way to go fast, is to go well.',
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const getNextAnecdote = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * anecdotes.length);
    } while (randomIndex === selected);
    setSelected(randomIndex);
  };

  const voteAnecdote = () => {
    const copyOfVotes = [...votes];
    copyOfVotes[selected]++;
    setVotes(copyOfVotes);
  };

  const mostVotedAnecdote = votes.indexOf(Math.max(...votes));

  // Button Component (without separation)
  const Button = ({ onClick, text }) => (
    <button onClick={onClick}>
      {text}
    </button>
  );

  // StatisticLine Component (without separation)
  const StatisticLine = ({ text, value }) => (
    <div>
      <p>{text} has {value} votes</p>
    </div>
  );

  // Statistics Component (without separation)
  const Statistics = () => (
    <div>
      <h2>Anecdote with Most Votes</h2>
      <StatisticLine text={anecdotes[mostVotedAnecdote]} value={votes[mostVotedAnecdote]} />
    </div>
  );

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button onClick={voteAnecdote} text="Vote" />
      <Button onClick={getNextAnecdote} text="Next Anecdote" />

      <Statistics />
    </div>
  );
};

export default App;
