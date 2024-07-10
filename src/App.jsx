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

  //Call Back Handler
  const handleSearch = (event) =>
  {
    console.log(event.target.value);
  };

  return (
    <div>
      <h1>Road To React</h1>

      <Search onSearch={handleSearch}/> {/*passing function for callback from child to parent */}

      <hr /> {/*Horizontal Break syntax in html */}

      <List list={stories}/> {/*Calling another component*/}

    </div>
  );
}

const List = (props) =>
{
  console.log('List Render');
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
  //create search state
  const [searchTerm,setSearchTerm] = React.useState({str: '', num: 0});

  const handleChange = (event) => {
    let n = searchTerm.num;
    n++;
    setSearchTerm({str: event.target.value, num: n});

    //Execute callback
    props.onSearch(event);
  };
  return(
    <div>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" onChange={handleChange}/>

        <p>
          Searching for <strong>{searchTerm.str} {searchTerm.num}</strong>
        </p>
    </div>
  )
}

export default App
