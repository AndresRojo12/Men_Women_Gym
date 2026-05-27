import { api, apiMultipart } from '../services/api';

export const loginRequest = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const access_token = response.data.access_token;

    return access_token;
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

export const getCurrentUser = async (token: string) => {
  const res = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const CategoryRequest = async ({
  action,
  data,
  file,
  token,
  id,
}: {
  action: 'create' | 'update' | 'delete';
  data?: {
    name: string;
  };
  file?: any;
  token: string;
  id?: string;
}) => {
  try {
    // ELIMINAR
    if (action === 'delete') {
      const response = await api.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }

    // CREAR / ACTUALIZAR
    const formData = new FormData();

    if (data?.name) {
      formData.append('name', data.name);
    }

    if (file?.uri) {
      const imageResponse = await fetch(file.uri);

      const blob = await imageResponse.blob();

      formData.append('file', blob, 'image.jpg');
    }

    let response;

    // CREAR
    if (action === 'create') {
      response = await apiMultipart.post('/categories', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // ACTUALIZAR
    if (action === 'update') {
      response = await api.put(`/categories/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return response?.data;
  } catch (error: any) {
    throw error;
  }
};
