import './App.css'
import * as React from 'react'

const initialStories = [
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


const getAsyncStories = () => //simulating asynchronous data fetching with 2 second delay
{
  return new Promise((resolve) => {
    return setTimeout(
      () => {
        return resolve({data : {stories: initialStories} })
      },2000)
  });
};

//Reducer Function
const storiesReducer = (state,action) =>
{
  switch (action.type)
  {
    case 'SET_STORIES':
      {
        return action.payload;
      }
    case 'REMOVE_STORY':
      {
        return state.filter((story) => {
          return action.payload.objectID !== story.objectID;
        });
      }
      default:
        //unhandled case
        throw new Error();
  }
};

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

  console.log('App Render');

  const [stories,dispatchStories] = React.useReducer(storiesReducer,[]);
  const [isLoading,setIsLoading] = React.useState(false);//for loading indication of data fetching
  const [isError,setIsError] = React.useState(false);//for error handling during data fetching

  //Fetching Data (simulation)
  React.useEffect(() => 
  {
    setIsLoading(true);
    getAsyncStories().then(result => 
    {
      dispatchStories({type: 'SET_STORIES', payload: result.data.stories});
      setIsLoading(false);
    }).catch(()=>{
      setIsError(true);
    });
  },[]);

  //Remove item Handler
  const handleRemoveStory = (item) =>
  {
    console.log('Remove Story Handler activated');
    
    dispatchStories({type: 'REMOVE_STORY' , payload: item});

  };

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

      {isError && <strong>Something went wrong. Please Check Your Connection...</strong>}

      {/*Performing conditional Rendering using Ternary operator */}
      {
        isLoading ? 
        (
          <strong>Loading...</strong>
        ) :
        (
          <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
        )
      }

    </div>
  );
}

const List = ({list, onRemoveItem}) =>
{
  console.log('List Render');
  return (
  <ul> {/*Unordered list tag in html*/}
  {
    list.map((itm) =>{
      return (<Item key={itm.objectID} item={itm} onRemoveItem={onRemoveItem} />);
    })
  }
</ul>
  )
}

const Item = ({item, onRemoveItem}) =>
{
  console.log('Item Render');
  return(<li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span> {item.author} </span>
    <span> {item.num_comments} </span>
    <span> {item.points} </span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>);
}

const InputWithLabel =({id, type ='text', value, isFocused, onInputChange, children}) =>
{//type is provided default value of text
  console.log(id + ' Render');

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
