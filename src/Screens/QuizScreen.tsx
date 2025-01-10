import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ImageBackground, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { saveScore } from '../utils/scoreStorage'; // scoreStorage.js dosyasından fonksiyonları içe aktar
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const QuizScreen = () => {
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(30);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [askedQuestions, setAskedQuestions] = useState(new Set());
  const slideAnimation = new Animated.Value(0);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    const snapshot = await database().ref('/questions').once('value');
    if (snapshot.exists()) {
      const questionsData = snapshot.val();
      const questionArray = Object.values(questionsData);
      const shuffledQuestions = shuffleArray(questionArray);
      setQuestions(shuffledQuestions);
      setAskedQuestions(new Set()); // Reset asked questions
    }
    startTimer();
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          endGame();
          return 0;
        }
      });
    }, 1000);
  };

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setUserScore(userScore + 1);
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        goToNextQuestion();
        slideAnimation.setValue(0);
      });
    } else {
      Animated.timing(slideAnimation, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }).start(endGame);
    }
  };

  const getHint = () => {
    if (hintsRemaining > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      Alert.alert('İpucu', `Doğru cevap: ${currentQuestion.correctAnswer}`);
      setHintsRemaining(hintsRemaining - 1);
    } else {
      Alert.alert('Uyarı', 'İpucu almak için yeterli ipucunuz yok.');
    }
  };

  const goToNextQuestion = () => {
    const updatedAskedQuestions = new Set(askedQuestions);
    updatedAskedQuestions.add(currentQuestionIndex);
    setAskedQuestions(updatedAskedQuestions);

    if (updatedAskedQuestions.size < questions.length) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setRemainingTime(30);
        slideAnimation.setValue(0);
      });
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    saveScore(userScore);
    Alert.alert('Oyun Sonu','Yanlış Cevap Verdiniz.');
    navigation.goBack();
  };

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ImageBackground source={require('../../background/AS.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerItem}>
            <Text style={styles.score}>PUAN: {userScore}</Text>
          </View>
          <View style={styles.headerItem}>
            <TouchableOpacity onPress={getHint} style={styles.hintButton}>
              <Text style={styles.hintButtonText}>İpucu Al</Text>
            </TouchableOpacity>
            <View style={styles.heartsContainer}>
              {[...Array(hintsRemaining)].map((_, index) => (
                <Image key={index} source={require('../../background/ipucu.png')} style={styles.heartIcon} />
              ))}
            </View>
          </View>
        </View>
        <Animated.View style={[styles.card, { transform: [{ translateX: slideAnimation.interpolate({ inputRange: [-1, 1], outputRange: [-500, 500] }) }] }]}>
          <Text style={styles.question}>{currentQuestion.question}</Text>
          <Image source={{ uri: currentQuestion.image }} style={styles.image} />
          <View style={styles.choicesContainer}>
            {currentQuestion.choices.map((choice, index) => (
              <TouchableOpacity key={index} onPress={() => handleAnswer(choice)} style={styles.choiceButton}>
                <Text style={styles.choiceText}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        <Text style={styles.remainingTime}>{remainingTime}</Text>
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
    padding: wp('5%'), // Yüzdelik değer kullanımı
    backgroundColor: 'rgba(0, 123, 255, 0.8)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: wp('5%'),
    marginTop: hp('5%'),
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontSize: wp('6%'),
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  hintButton: {
    backgroundColor: '#1e81b0',
    borderRadius: 10,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    marginRight: wp('2.5%'),
  },
  hintButtonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontFamily: 'Roboto',
  },
  heartsContainer: {
    flexDirection: 'row',
  },
  heartIcon: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    marginRight: wp('1.25%'),
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: wp('4%'),
    marginTop: hp('4%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
    height: '75%',
  },
  question: {
    fontSize: wp('5.5%'),
    marginBottom: hp('1.5%'),
    textAlign: 'center',
    fontFamily: 'Roboto',
    color: '#003366',
  },
  image: {
    width: '100%',
    height: hp('25%'),
    resizeMode: 'cover',
    marginBottom: hp('1.5%'),
    borderRadius: 10,
  },
  choicesContainer: {
    marginTop: hp('1%'),
  },
  choiceButton: {
    backgroundColor: '#00509E',
    borderRadius: 10,
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    alignItems: 'center',
  },
  choiceText: {
    fontSize: wp('4%'),
    color: 'white',
    fontFamily: 'Roboto',
  },
  remainingTime: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginTop: hp('1.5%'),
    fontSize: wp('9%'),
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: wp('5%'),
    color: 'white',
  },
});

export default QuizScreen;
