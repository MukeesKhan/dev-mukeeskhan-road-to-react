import './App.css'

const welcome = 
{
  greeting : 'Hey',
  title: 'React',
};

function showMessage(text)
{
  return text;
};

function App()
{

  return (
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <h2>{showMessage("Welcome All")}</h2>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App
