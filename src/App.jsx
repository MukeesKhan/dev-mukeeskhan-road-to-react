import './App.css'
import * as React from 'react'

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

  console.log('App Render');

    //create search state
    const [searchTerm,setSearchTerm] = React.useState('React');

  //Call Back Handler
  const handleSearch = (event) =>
  {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
  };

  const searchedStories =stories.filter((story) =>{
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>Road To React</h1>

      <Search onSearch={handleSearch} searchVal={searchTerm}/> {/*passing function for callback from child to parent */}

      <hr /> {/*Horizontal Break syntax in html */}

      <List list={searchedStories}/> {/*Calling another component*/}

    </div>
  );
}

const List = (props) =>
{
  console.log('List Render');
  return (
  <ul> {/*Unordered list tag in html*/}
  {
    props.list.map((itm) =>{
      return (<Item key={itm.objectID} item={itm} />);
    })
  }
</ul>
  )
}

const Item = (props) =>
{
  console.log('Item Render');
  return(<li>
    <span>
      <a href={props.item.url}>{props.item.title}</a>
    </span>
    <span> {props.item.author} </span>
    <span> {props.item.num_comments} </span>
    <span> {props.item.points} </span>
  </li>);
}

const Search =(props) =>
{
  console.log('Search Render');

  return(
    <div>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" value={props.searchVal} onChange={props.onSearch}/>

        <p>
          Searching for <strong>{props.searchVal}</strong>
        </p>
    </div>
  )
}

export default App
