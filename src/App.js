import './App.css';

import React, { useReducer, useRef, useEffect, useLayoutEffect, useCallback, forwardRef } from "react"
import PropTypes from 'prop-types';

import Tabletop from "tabletop"

import { map, keys, find } from "lodash"

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";



const initialState = {
  detail: null,
  entries: []
}

const viewReducer = (state, action) => {
  switch(action.type) { 
    case "ENTRIES":
      return { ...state, entries: action.entries }
    case "VIEW":
      console.log(action)
      return { ...state, detail: action.id }
    default:
      return state;

  }
}

function processEntries(data) {
   let entries = map(data, (entry,idx) => { 

     /*
     */
     console.log(keys(entry))

     let thumb = entry["Poster Thumbnail"];
     let poster = entry["Poster Full Size"];

     thumb = thumb.split("=")[1]
     poster = poster.split("=")[1]

     thumb = "https://drive.google.com/uc?export=download&id=" + thumb;
     poster = "https://drive.google.com/uc?export=download&id=" + poster;

     let slugs = (entry["YouTube Link"]||"").split("/")
     let youtube = slugs[slugs.length-1]

     return {
       id: entry['Last Name'].toLowerCase(),
       thumb: thumb,
       poster: poster,
       first_name: entry['First Name'],
       last_name: entry['Last Name'],
       name: `${entry['First Name']} ${entry['Last Name']}`,
       abstract: entry["Abstract"],
       time: entry["Time"],
       room: entry["Room Link"],
       youtube: youtube,
       title: entry["Title"]
     }
   })
   console.log(entries)
   return  entries
}

function GalleryDetail({entries}) {
  let { id } = useParams();
  let entry= find(entries, (entry) => entry.id == id.toLowerCase())



  useEffect(() => {
    window.scrollTo(0,0)
  },[])

  if(!entry) {
    return <React.Fragment/>
  }

  return <React.Fragment>
         <header>
        <Link to="/"> <h3 className="back"><div>&laquo;</div> Online Symposium May 12th 2020</h3></Link>
        <h1>{entry.title}</h1>
        <h2>{entry.name}</h2>
        </header>
      
        <section className="work">
            <div className='work-image'><img src={entry.poster} /></div>
            <div className="time">
              <h2>{entry.time}</h2>
              <a target="_blank"  href={entry.room}><h2 className="button">Join Event</h2></a>
            </div>
            {entry.abstract.split('\n\n').map((item, key) => {
              return <p key={key}>{item}</p>
            })}
            <div className="video">
              <iframe src={`https://www.youtube.com/embed/${entry.youtube}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>  
            <div className="time">
              <h2>{entry.time}</h2>
              <a target="_blank" href={entry.room}><h2 className="button">Join Event</h2></a>
            </div>
        </section>
        </React.Fragment>;
}

function GalleryItem({entry}) {
  return  <Link to={`/${entry.id}`}>
              <div className="piece" >
                <div className='piece-image'><img src={entry.thumb} /></div>  
                <h1>{entry.title}</h1>
                <h2>{entry.name}</h2>
              </div>
           </Link>;
}


function renderContent(detail,entries,dispatch) {
  if(detail !== null) {
    return 
  } else {
    return  <React.Fragment>
     
    </React.Fragment>
  }
}

function App() {
  const [
    {
      detail,
      entries
    },
    dispatch
  ] = useReducer(viewReducer, initialState)


  useEffect(() => { 
    Tabletop.init( {
      key: 'https://docs.google.com/spreadsheets/d/1lzAodBh1ohPURnCNYbx-CgA00TEzRFi4G4qE7_Z3UX0/edit?usp=sharing',
      simpleSheet: true }
    ).then(function(data, tabletop) { 
      dispatch({ type: "ENTRIES", entries: processEntries(data) })
   }) }, []);



  return (
    <Router>
    <div>
    <Switch>
          <Route exact path="/">
            <header>
              <h3>Online Symposium May 12th 2020</h3>
              <h1>Degree Project <br/>Symposium</h1>
              <h2>Communication Design Senior Class</h2>
            </header>
            <section id="gallery">
              {map(entries, (entry,index) => <GalleryItem entry={entry} key={index} />) }
            </section>
          </Route>
          <Route path="/:id" children={<GalleryDetail entries={entries} />} />
        </Switch>
        {renderContent(detail,entries, dispatch)}
      <footer>
        <h3><img src="light-logo.png" />621 Huntington Avenue, Boston, MA, 02115 | 617.879.7000 | </h3>
      </footer>
     </div>
    </Router>
  );
}

export default App;
