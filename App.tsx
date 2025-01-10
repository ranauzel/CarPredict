import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GirisScreen from './src/Screens/GirisScreen';
import QuizScreen from './src/Screens/QuizScreen';
import ScoreScreen from './src/Screens/SkorScreen'; // Yeni eklendi

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Giris" component={GirisScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Score" component={ScoreScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
