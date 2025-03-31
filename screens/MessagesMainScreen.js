import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, TextInput,  TouchableOpacity,RefreshControl,ActivityIndicator, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery } from '../api';
import { useFocusEffect } from '@react-navigation/native';

export const MessagesMainScreen = () => {
    const user = useSelector(state => state.auth);
    const navigation = useNavigation()
    const [data,setData] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
          const connection = await fetch('http://185.129.51.171/api/create_connection/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${user.token}`
            },
            body: JSON.stringify({
              message: '',
              user_receiver: 'admin',
              post_id: 0,
            }),
          });

          
          const response = await fetch('http://185.129.51.171/api/income_messages/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${user.token}`, // Include your authorization token here
            },
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          setData(data)

        } catch (error) {
          console.error('There was a problem with your fetch operation:', error);
        }
      }

    const onRefresh = useCallback(() => {
      fetchData()
    }, [fetchData]);

    useFocusEffect(
      useCallback(() => {
        fetchData();
      }, [])
    );
    
    return (
        <ScrollView style={{marginTop:20,width:'90%',alignSelf:'center'}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
          scrollEventThrottle={1000}/>
        }>
        {data && data.length > 0 ? 
            data.map((item) => (
              (user.user.username !== 'admin' || (user.user.username === 'admin' && item.last_message)) ?
              <>
                <TouchableOpacity key={item.id} onPress={() => { navigation.navigate('MessagesDm', { connection_id: item.id, receiver: item.receiver, post_id: item.post_id }) }} style={{borderRadius: 10, backgroundColor: '#F6F6F6', width: '100%', height: 60, paddingHorizontal: 10, alignItems: 'center', flexDirection: 'row', marginBottom: 10 }}>
                    <Image
                        style={{ height: 36, width: 36, borderRadius: 100 }}
                        source={
                            item.receiver_info.username === user.user.username
                            ? item.sender_info.profile_image
                                ? { uri: `http://185.129.51.171${item.sender_info.profile_image}` }
                                : require('../assets/profilePurple.png')
                            : item.receiver_info.profile_image
                                ? { uri: `http://185.129.51.171${item.receiver_info.profile_image}` }
                                : require('../assets/profilePurple.png')
                        }
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontFamily: 'medium', fontSize: 16 }}>
                        {
                          (item.receiver_info.username === 'admin' && item.sender_info.username === user.user.username) ||
                          (item.sender_info.username === 'admin' && item.receiver_info.username === user.user.username)
                            ? 'Поддержка'
                            : item.receiver_info.username === user.user.username
                            ? item.sender_info.username
                            : item.receiver_info.username 
                        }
                        </Text>
                        <Text style={{ fontFamily: 'regular', fontSize: 14, color: '#9C9C9C' }}>{item.last_message !== null ? item.last_message.text : "Напишите вопросы по приложению"}</Text>
                    </View>
                </TouchableOpacity> 
                {
                  (item.receiver_info.username === 'admin' && item.sender_info.username === user.user.username) ||
                  (item.sender_info.username === 'admin' && item.receiver_info.username === user.user.username)
                    ? <View style={{marginTop:15,borderTopWidth:1,opacity:.15,paddingTop:15}}></View> 
                    : null
                    ? null
                    : null
                }
                </>: null
            )) :
            <View>
              <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'medium', marginTop: 100, color: '#6C6C6C' }}>Сообщений нет</Text>
              <Text style={{ alignSelf: 'center', fontSize: 15, fontWeight: 'regular', marginTop: 15, color: '#F26F1D' }}>Зайдите в публикацию и начните диалог</Text>
            </View>
        }
        </ScrollView>
    );
  }
