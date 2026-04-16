import React from 'react';
import { View } from 'react-native';
import Exercises from '../components/GetExercises';
import MainHeader from '../../common/components/MainHeader';

const ExercisesScreen = () => (
  <View style={{ flex: 1 }}>
    <MainHeader />
    <Exercises />
  </View>
);

export default ExercisesScreen;