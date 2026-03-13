import { View, Text, Image, Pressable, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { api } from '../../auth/services/api';

interface Category {
  id: string;
  name: string;
  image: string;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      // axios instance with env baseURL; override with platform URL if necessary
      const response = await api.get<Category[]>('/categories', {});
      const data = response.data;
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View style={{ padding: 15, borderRadius: 8, maxWidth: 360, margin: 12 }}>
      {categories.map((category) => (
        <Text key={category.id}>{category.name}</Text>
      ))}

      <Image
        source={{
          uri: 'https://gluestack.github.io/public-blog-video-assets/yoga.png',
        }}
        style={{
          marginBottom: 24,
          height: 240,
          width: '100%',
          borderRadius: 8,
        }}
      />

      <Text style={{ fontSize: 14, marginBottom: 8, color: '#666' }}>
        May 15, 2023
      </Text>

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>
        {categories.length > 0 ? categories[0].name : 'Cargando...'}
      </Text>

      <Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#0066cc' }}>
            Read Blog
          </Text>
          <Text style={{ marginLeft: 8, color: '#0066cc' }}>→</Text>
        </View>
      </Pressable>
    </View>
  );
}

export default Categories;
