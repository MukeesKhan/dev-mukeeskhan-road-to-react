import './App.css'
import * as React from 'react'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

//Reducer Function
const storiesReducer = (state,action) =>
{
  switch (action.type)
  {
    case 'STORIES_FETCH_INIT':
    {//...state makes copy of object using spread operator then overwrites the properties
      return {...state, isLoading: true, isError: false};
    }
    case 'STORIES_FETCH_SUCCESS':
    {
      return {...state, isLoading: false, isError: false, data: action.payload};
    }
    case 'STORIES_FETCH_FAILURE':
    {
      return {...state, isLoading: false, isError:true};
    }
    case 'REMOVE_STORY':
    {
      return {
        ...state, data: state.data.filter((story) => 
        {
          return (action.payload.objectID !== story.objectID);
        })
      };
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

  const [stories,dispatchStories] = React.useReducer(storiesReducer,{data: [], isLoading: false, isError: false});

  //Fetching Data (simulation)
  React.useEffect(() => 
  {
    //starting data fetch
    dispatchStories({type: 'STORIES_FETCH_INIT'});
    
    //remote fetching from api
    fetch(`${API_ENDPOINT}react`)
      .then((response) => response.json()).then(result => 
    {
      dispatchStories({type: 'STORIES_FETCH_SUCCESS', payload: result.hits});
    }).catch(()=>{
      dispatchStories({type: 'STORIES_FETCH_FAILURE'})
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

  const searchedStories =stories.data.filter((story) =>{
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

      {stories.isError && <strong>Something went wrong. Please Check Your Connection...</strong>}

      {/*Performing conditional Rendering using Ternary operator */}
      {
        stories.isLoading ? 
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
