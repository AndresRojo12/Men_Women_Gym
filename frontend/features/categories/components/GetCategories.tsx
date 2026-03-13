import { View, Text, Image, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { api } from '../../auth/services/api';

interface Category {
  id: number;
  name: string;
  image: string;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get<Category[]>('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategory = ({ item }: { item: Category }) => {
    return (
      <Pressable
        style={{
         
          margin: 8,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#000'
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: '100%',
            height: 140,
            position: 'absolute'
          }}
        />

        <View
          style={{
            height: 140,
            justifyContent: 'flex-end',
            padding: 10,
            backgroundColor: 'rgba(0,0,0,0.3)'
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold'
            }}
          >
            {item.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      contentContainerStyle={{ padding: 10 }}
    />
  );
}

export default Categories;