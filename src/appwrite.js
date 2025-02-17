import {Client,Databases,Query,ID} from 'appwrite'
const DATABASE_ID=import.meta.env.VITE_APPWRITE_DATABASE_ID
const PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID
const COLLECTION_ID=import.meta.env.VITE_APPWRITE_COLLECTION_ID

const client=new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(PROJECT_ID)
const database =new Databases(client)
export const updateSearchCount=async(searchTerm,movie)=>{
    //  console.log("DAta Passed",searchTerm,movie)
    try{
        const result=await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.equal('searchTerm',searchTerm)
    ])
        if(result.documents.length>0){
            const documents=result.documents[0]
            await database.updateDocument(DATABASE_ID,COLLECTION_ID,documents.$id,{
                count:documents.count+1
            })
        }else{
            console.log("DAta Passed",searchTerm,movie) 
           await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
                searchTerm,
                count:1,
                movie_id:movie.id,
                poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    
    }catch(error){
        console.log("DAta Passed",error)
    }
    
}

export const getTredingMovies=async()=>{
    //  console.log("DAta Passed",searchTerm,movie)
    try{
        const result=await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.orderDesc('count')
           
    ])
    console.log(result)
    if(result.documents.length>0){
        // console.log("YEs reachefd",result.documents)
        return  result.documents
    }else{
       
        return []
    }
    
    }catch(error){
        console.log("DAta Passed",error)
    }
    
}