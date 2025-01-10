import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GirisScreen = () => {
  const navigation = useNavigation();

  const handlePlay = () => {
    navigation.navigate('Quiz'); // Oyun ekranına yönlendirme
  };

  const handleScore = () => {
    navigation.navigate('Score'); // Skor sayfasına yönlendirme
  };

  return (
    <ImageBackground source={require('../../background/AS.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>CarPredict</Text>
        <Text style={styles.subtitle}>Hoş Geldiniz!</Text>
        <TouchableOpacity style={styles.button} onPress={handlePlay}>
          <View style={styles.iconContainer}>
            <Image source={require('../../background/playButton.png')} style={styles.icon} />
            <Text style={styles.playText}>OYNA</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.scoreButton} onPress={handleScore}>
          <Text style={styles.scoreButtonText}>Skor Tablosu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.adBanner}>
        <Text style={styles.adText}>Reklam Alanı</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 123, 255, 0.8)',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    fontFamily: 'Arial',
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 30,
    color: '#fff',
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 70,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  playText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreButton: {
    backgroundColor: '#fff',
    borderRadius: 70,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  scoreButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  adBanner: {
    backgroundColor: 'rgba(204, 204, 204, 0.8)',
    width: '100%',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 20,
  },
  adText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GirisScreen;
