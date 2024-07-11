import './App.css'
import * as React from 'react'


//Custom React Hook
const useStorageState = (key,initialState) =>{
  const [term,setTerm]=React.useState(localStorage.getItem(key)??initialState);

  React.useEffect(() =>
  {
    localStorage.setItem(key,term);
  },[term,key]);

  return [term,setTerm];
};

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
  const [searchTerm,setSearchTerm] = useStorageState('search', 'React');

  //Call Back Handler
  const handleSearch = (event) =>
  {
    console.log('Call back handler activated');
    setSearchTerm(event.target.value);
  };

  const searchedStories =stories.filter((story) =>{
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>Road To React</h1>

      {/*Creating Search Component */}  {/*isFocused by default alone means it is true */}
      <InputWithLabel  id="search" value={searchTerm} isFocused onInputChange={handleSearch}> {/*passing function for callback from child to parent */}

      <strong>Search:</strong>
      </InputWithLabel>

      <hr /> {/*Horizontal Break syntax in html */}

      <List list={searchedStories}/> {/*Calling another component*/}

    </div>
  );
}

const List = ({list}) =>
{
  console.log('List Render');
  return (
  <ul> {/*Unordered list tag in html*/}
  {
    list.map((itm) =>{
      return (<Item key={itm.objectID} item={itm} />);
    })
  }
</ul>
  )
}

const Item = ({item}) =>
{
  console.log('Item Render');
  return(<li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span> {item.author} </span>
    <span> {item.num_comments} </span>
    <span> {item.points} </span>
  </li>);
}

const InputWithLabel =({id, type ='text', value, isFocused, onInputChange, children}) =>
{//type is provided default value of text
  console.log({children} + 'Render');

  const inputRef =React.useRef();//null reference at start

  React.useEffect(() => {
    if(isFocused && inputRef.current)
    {
      inputRef.current.focus();
    }
  },[isFocused]);

  return(
    <React.Fragment> {/* Short version <> html   </>*/ }
        <label htmlFor={id}>{children} </label>
        &nbsp;
        <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange}/>
    </React.Fragment>
  )
}

export default App
