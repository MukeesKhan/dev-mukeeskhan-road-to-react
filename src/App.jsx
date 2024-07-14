import './App.css'
import * as React from 'react';
import axios from 'axios';

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
  const [term,setTerm]=React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() =>
  {
    localStorage.setItem(key,term);
  },[term,key]);

  return [term,setTerm];
};

const App = () =>
{

  console.log('App Render');

  //STATES SECTION
  const [stories,dispatchStories] = React.useReducer(storiesReducer,{data: [], isLoading: false, isError: false});

  //create search state
  const [searchTerm,setSearchTerm] = useStorageState('search', 'React');

  const [url,setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  //END OF STATES SECTION

  //EVENT HANDLER FUNCTIONS SECTION
  //Fetching Data
  const handleFetchStories = React.useCallback( async () => //memoized function
  {

    //removed empty string check as button to conduct fetch becomes disabled when empty string is set
    //starting data fetch
    dispatchStories({type: 'STORIES_FETCH_INIT'});
    
    //remote fetching from api
    try{
      const result = await axios.get(url);

      dispatchStories({type: 'STORIES_FETCH_SUCCESS' , payload: result.data.hits});
    } catch{
      dispatchStories({type: 'STORIES_FETCH_FAILURE' });
    }
  },[url]);

  React.useEffect(() =>
  {
    handleFetchStories();
  },[handleFetchStories]);

  //Remove item Handler
  const handleRemoveStory = (item) =>
  {
    console.log('Remove Story Handler activated');
    
    dispatchStories({type: 'REMOVE_STORY' , payload: item});

  };

  //Call Back Handler For Search Input
  const handleSearchInput = (event) =>
  {
    console.log('Search Input Call back handler activated');
    setSearchTerm(event.target.value);
  };

  //Call Back Handler for Confirmed Search Input
  const handleSearchSubmit = () =>
  {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  //END OF EVENT HANDLER FUNCTIONS SECTION

  return (
    <div>
      <h1>Road To React</h1>

      {/*Creating Search Component */}  {/*isFocused by default alone means it is true */}
      <InputWithLabel  id="search" value={searchTerm} isFocused onInputChange={handleSearchInput}> {/*passing function for callback from child to parent */}

      <strong>Search:</strong>
      </InputWithLabel>

      <button
        type="button"
        disabled={!searchTerm}
        onClick={handleSearchSubmit}
      >
        Submit
      </button>

      <hr /> {/*Horizontal Break syntax in html */}

      {stories.isError && <strong>Something went wrong. Please Check Your Connection...</strong>}

      {/*Performing conditional Rendering using Ternary operator */}
      {
        stories.isLoading ? 
        (
          <strong>Loading...</strong>
        ) :
        (
          <List list={stories.data} onRemoveItem={handleRemoveStory}/>
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
