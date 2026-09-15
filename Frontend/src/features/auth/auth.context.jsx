import {createContext,useState,useEffect} from 'react';
import {login,register,getMe} from "./services/auth.api"

export const AuthContext = createContext();
export function AuthProvider({children}){
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(false);
    const [authReady,setAuthReady]=useState(false);
    useEffect(()=>{
        // Restore the user after a browser refresh when the auth cookie is still valid.
        getMe().then((response)=>setUser(response.user)).catch(()=>setUser(null)).finally(()=>setAuthReady(true));
    },[])
    const handleLogin=async(username,password)=>{
        setLoading(true);
        try{
            const response=await login(username,password)
            setUser(response.user)
            return response
        }catch(err){
            console.log(err)
            throw err
        }finally{
            setLoading(false)
        }

    }
    const handleRegister=async(username,email,password)=>{
    setLoading(true);
    try{
        const response=await register(username,email,password);
        setUser(response.user)
        return response
    }catch(err){
        console.log(err)
        throw err
    }finally{
        setLoading(false)
    }}
    return(
        <AuthContext.Provider value={{user,setUser,loading,authReady,handleLogin,handleRegister}}>
            {children}

        </AuthContext.Provider>
    )
}
