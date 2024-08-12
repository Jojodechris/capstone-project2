// app

import React, {createContext,useContext,useState} from "react";

const AppContext=createContext(null);

export  const useAppContext = ()=>{
    const context = useContext(AppContext);
    
    if(context===undefined){
        throw new Error("useAppContext must be used within the AppProvider")
    }
    return context;
};

// Provider Component

const AppContextProvider = ({children})=>{
    const[favorites,setFavorites]=useState([]);


    const addToFavorites =(book)=> {
        const oldFavorites=[...favorites];
        const newFavorites=oldFavorites.concat(book)
        setFavorites(newFavorites);

    }

    const removeFromFavorites =(id)=>{
        const oldFavorites=[...favorites];
        const newFavorites= oldFavorites.filter((book)=> book.id!==id);
        setFavorites(newFavorites);
    }

    return(
        <AppContext.Provider value={{favorites,addToFavorites,removeFromFavorites}}>
            {children}
            </AppContext.Provider>  
    )
}

export default AppContextProvider;