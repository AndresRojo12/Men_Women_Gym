import React from 'react';
import { View } from 'react-native';
import Categories from '../components/GetCategories';
import MainHeader from '../../common/components/MainHeader';

const CategoriesScreen = () => (
  <View style={{ flex: 1 }}>
    <MainHeader onPressAvatar={() => {}} />
    <Categories />
  </View>
);

export default CategoriesScreen;