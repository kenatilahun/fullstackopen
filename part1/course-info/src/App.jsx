const Header = ({ title }) => {
  return <h1>{title}</h1>;
};

const Part = ({ topic }) => {
  return (
    <p>
      {topic.name} {topic.exercises}
    </p>
  );
};

const Content = ({ sections }) => {
  return (
    <div>
      <Part topic={sections[0]} />
      <Part topic={sections[1]} />
      <Part topic={sections[2]} />
    </div>
  );
};

const Total = ({ sections }) => {
  const totalExercises =
    sections[0].exercises + sections[1].exercises + sections[2].exercises;
  return <p>Total exercises: {totalExercises}</p>;
};

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  };

  return (
    <div>
      <Header title={course.name} />
      <Content sections={course.parts} />
      <Total sections={course.parts} />
    </div>
  );
};

export default App;
