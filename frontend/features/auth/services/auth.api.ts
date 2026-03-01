import { api } from '../../../services/api'; 

export const loginRequest = async (email: string, password: string) => { 
  try { 
    const response = await api.post('/auth/login', { 
      email, 
      password, 
    }); 

    return response.data.access_token; 
  } catch (error: any) { 
    throw error; 
  } 
};

export const RegisterRequest = async (email: string, password: string) => { 
  try { 
    const response = await api.post('/auth/register', { 
      email, 
      password, 
    }); 

    return response.data; 
  } catch (error: any) { 
    throw error; 
  } 
};