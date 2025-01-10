import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, Animated, Easing } from 'react-native';
import { getScores, resetScores } from '../utils/scoreStorage';

const ScoreScreen = () => {
  const [scores, setScores] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchScores();
    fadeIn();
    scaleIn();
  }, []);

  const fetchScores = async () => {
    const userScores = await getScores();
    setScores(userScores);
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const scaleIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.back()),
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item, index }) => (
    <Animated.View style={[styles.scoreItem, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <Text style={styles.scoreText}>{index + 1}. Skor: {item}</Text>
    </Animated.View>
  );

  const handleResetScores = async () => {
    await resetScores();
    setScores([]);
  };

  return (
    <ImageBackground source={require('../../background/AS.jpg')} style={styles.background} blurRadius={5}>
      <View style={styles.container}>
        <Text style={styles.title}>Skor Tablosu</Text>
        <FlatList
          data={scores}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatlistContainer}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.resetButton} onPress={handleResetScores}>
          <Text style={styles.resetButtonText}>Skorları Sıfırla</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  flatlistContainer: {
    flexGrow: 1,
  },
  scoreItem: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
  },
  resetButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ScoreScreen;
