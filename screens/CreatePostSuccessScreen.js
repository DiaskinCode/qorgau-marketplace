import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export const CreatePostSuccessScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'CreatePostCategory' }],
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ alignSelf: 'center', marginTop: 200, width: '80%' }}>
      <Text
        style={{
          fontSize: 30,
          fontFamily: 'bold',
          color: '#F26D1D',
          textAlign: 'center',
        }}
      >
        Пост успешно создан
      </Text>
      <Text
        style={{
          fontSize: 15,
          marginTop: 20,
          fontFamily: 'regular',
          color: '#444',
          textAlign: 'center',
        }}
      >
        Пост направлен на модерацию. Обычно модерация поста занимает не больше дня
      </Text>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('HomeTab', { screen: 'Home' })
        }
      >
        <Text
          style={{
            fontSize: 15,
            marginTop: 30,
            fontFamily: 'medium',
            color: '#111',
            textAlign: 'center',
          }}
        >
          Вернуться на главную
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
            navigation.reset({
                index: 0,
                routes: [{ name: 'CreatePostCategory' }],
              })
        }
      >
        <Text
          style={{
            fontSize: 15,
            marginTop: 30,
            fontFamily: 'medium',
            color: '#111',
            textAlign: 'center',
          }}
        >
          Создать новое объявление
        </Text>
      </TouchableOpacity>
    </View>
  );
};
