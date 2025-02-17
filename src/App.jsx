import React from 'react'
import Search from './components/Search'
import { useState } from 'react'
import { useEffect } from 'react'
import Spinner from './components/Spinner'
import MovieCArd from './components/MovieCArd'
import {useDebounce} from 'react-use'
import { updateSearchCount } from './appwrite'
import { getTredingMovies } from './appwrite'
const API_BASE_URL='https://api.themoviedb.org/3'
const API_KEY=import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS={
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

const App = () => {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [tredingMovies,setTrendingMovies]=useState([])
  const [movieList, setMovieList] = useState([])
  const [error,setError]=useState("") 

  const [debounceSearchTerm, setDebounceSearchTerm] = useState('')

  useDebounce(()=>setDebounceSearchTerm(searchTerm),500,[searchTerm])

  const fetchMovies=async(query)=>{
    setLoading(true)
    setError("")
    try {
      console.log("Excutong",query)
      console.log("Api key :",API_KEY)
      const endpoint=query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`  
                      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response= await fetch(endpoint,API_OPTIONS)
      console.log(response)
      if(!response.ok){
        throw new Error('Failed to fetch movies')
        
        // return
      }else{
        const data=await response.json();
        console.log("DAta :",data)
        setMovieList(data.results)
        // console.log("Executing",query,data.results.length)
        if(query && data.results.length>0){
        
          updateSearchCount(query,data.results[0])
        }
        
      }
      

    }catch(error){
      console.log("Error Fetching movies",error)
      setError("Error Fetching Movies please try again later")
    } finally{
      setLoading(false)
    }

  }

  const fetchTredingMovies=async()=>{
     let   result=await getTredingMovies()
      console.log("Yes Reached here",result)

      setTrendingMovies(result)
  }

  useEffect(()=>{

    fetchMovies(searchTerm) 
  },[debounceSearchTerm])

//imorting the treding movies 
useEffect(() => {
  fetchTredingMovies()


}, [])


  return (
    <main className=''>
      <div className='pattern' />
      <div className='wrapper'>
    <header>
      <img src='./hero.png' alt='hero image'/> 
    <h1 ><span className='text-gradient'>Movies</span>You Will Enjoy Without the Hassle</h1>
    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>   
    </header>
   
    <section className='trending'>
      {/* <h2>Trending Movies</h2> */}
      <ul>
      { 
        tredingMovies.map((movie,index)=>(
        <li><p>{index+1}</p>
        <img src={movie.poster_url} alt={movie.title}/>
            </li>
         
        ))
      }
      </ul>
    </section>
    <section className='all-movies text-white mt-10'>
    
      <h2 >All Movies</h2>
      
      {loading ? (
        <div className='flex justify-center items-center'>
           <Spinner/>
        </div>
       
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
      <ul>

        {movieList.map((movie)=>(
          <MovieCArd key={movie.id} movie={movie} />
        ))}
      </ul>
      )
      }

    </section>
      
      </div>

    </main>
  )
}

export default App
