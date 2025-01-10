// scoreStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// Skorları getirmek için bir fonksiyon
export const getScores = async () => {
  try {
    const scoresString = await AsyncStorage.getItem('userScores');
    if (scoresString) {
      const scores = JSON.parse(scoresString);
      // Skorları en yüksekten alçağa doğru sırala
      scores.sort((a, b) => b - a);
      return scores;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Skorlar alınırken bir hata oluştu: ", error);
    return [];
  }
}

// Skor eklemek için bir fonksiyon
export const saveScore = async (score) => {
  try {
    const scores = await getScores();
    scores.push(score);
    await AsyncStorage.setItem('userScores', JSON.stringify(scores));
  } catch (error) {
    console.log("Skor kaydedilirken bir hata oluştu: ", error);
  }
}
export const resetScores = async () => {
  try {
    await AsyncStorage.removeItem('userScores');
    console.log("Skorlar sıfırlandı.");
  } catch (error) {
    console.log("Skorlar sıfırlanırken bir hata oluştu: ", error);
  }
}