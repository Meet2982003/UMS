import axios from 'axios'
// set backend base url
const BASE_URL = "http://localhost:6563";

// create axios instance

const api = axios.create({
    baseURL : BASE_URL,
    headers : {
        'Content-Type' : 'application/josn'
    },
    withCredentials : true //important for handling cookies cors origin  
});

// response interceptor for global error handling

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response){
            switch(error.response.status){
                case 401 : //Unauthorized
                    // redirect user to login or logout
                    authService.logout();
                    window.location.href = '/login';
                    break;
                case 403 : // Forbidden 
                    console.error("Access forbidden");
                    break;
                case 404 : // Resource not found
                    console.error("Resource not found");
                    break;
                case 500: //Internal server error
                    console.error("Internal server error has occured");
                    break;
                
            }
        }
        else if(error.request){
            //request made but no response recieved
            console.error("No response recieved",error.request);
        }
        else{
            // something happened in setting up request
            console.error("Error in seeting up request",error.message);
        }
        return Promise.reject(error);
    }
);

const authService = {
    
    // signup method
    signupNormalUser : async (username:string,email:string,password:string) => {
        try{
            const response = await api.post('/auth/registerNormalUser',{
                username,
                email,
                password
            });
            return response.data;
        }
        catch(error){
            console.error('Sign up failed',error);
            throw error;
        }
    },

    //login method

    login: async (username:string,password:string) =>{
        try{
            const response = await api.post('/auth/login',{
                username,
                password
            });

            const user = authService.fetchCurrentUser();

            return {
                ...response.data,
                user
            };
        }
        catch(error){
            console.error("Login failed",error);
            throw error
        }
    },

    //fetch current user 
    fetchCurrentUser: async () =>{
        try{
            const response = await api.get('/auth/getCurrentUser');
            // store userDto in local storage for quick access
            localStorage.setItem('user',JSON.stringify(response.data));
            return response.data;

        }
        catch(error:any){
            console.error("Error fetching user data",error);
            
            // if unauthorized then logout the user
            if(error.response && error.response.status === 401){
                await authService.logout();
            }
            return null;
        }
    },

    // fetch current user from localstorage
    getCurrentUser: () =>{
        const user = localStorage.getItem('user');
        try{
            return user ? JSON.parse(user) : null;
        }
        catch(error){
            console.error('Error parsing user data',error);
            return null;
        }
    },

    //logout method
    logout: async () => {
        try {
            // 1. call backend api
            await api.post('/auth/logout')
            // 2. clear any localstorage and states
            localStorage.removeItem('user')
        }
        catch (error){
            console.error('Logout failed',error);
        }
    },

    isAuthenticated: async () =>{
        try{
            //verify authentication by fetching current user
            const user = await authService.fetchCurrentUser();
            return !!user;
        }
        catch(error){
            return false;
        }
    }
}

export default authService;