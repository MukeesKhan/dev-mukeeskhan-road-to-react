import './App.css'

const App = () =>
{
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  return (
    <div>
      <h1>Road To React</h1>

      <Search />

      <hr /> {/*Horizontal Break syntax in html */}

      <List list={stories}/> {/*Calling another component*/}

    </div>
  );
}

const List = (props) =>
{
  return (
  <ul> {/*Unordered list tag in html*/}
  {
    props.list.filter((obj) => obj.num_comments>0).map((itm) =>{
      return (<Item key={itm.objectID} item={itm} />);
    })
  }
</ul>
  )
}

const Item = (props) =>
{
  return(<li>
    <span>
      <a href={props.item.url}>{props.item.title}</a>
    </span>
    <span> {props.item.author} </span>
    <span> {props.item.num_comments} </span>
    <span> {props.item.points} </span>
  </li>);
}

const Search =() =>
{
  const handleChange = (event) => {
    //synthetic event
    console.log(event);
    //value of target (here: input HTML element)
    console.log(event.target.value);
  };
  return(
    <div>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" onChange={handleChange}/>
    </div>
  )
}

export default App
