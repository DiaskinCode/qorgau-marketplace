import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, TextInput,  TouchableOpacity, FlatList, ScrollView, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery } from '../api';

export const MessagesMainScreen = () => {
    const user = useSelector(state => state.auth);
    const navigation = useNavigation()
    const [data,setData] = useState([])

    fetchData = async () => {
        try {
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
          // Handle the response data
          console.log('Data:', data);
          setData(data)
          
      
        } catch (error) {
          console.error('There was a problem with your fetch operation:', error);
        }
      }

    useEffect(()=>{
        fetchData()
    },[])

    return (
        <View style={{marginTop:20,width:'90%',alignSelf:'center'}}>
            {data ? 
                data.map((item)=>{
                    return (
                        <TouchableOpacity key={item.id} onPress={()=>{navigation.navigate('MessagesDm',{connection_id:item.id})}} style={{borderWidth:1,borderRadius:5,borderColor:'#F26F1D',width:'100%',height:55,paddingHorizontal:15,alignItems:'center',flexDirection:'row',marginTop:10,}}>
                            <Image style={{height:36,width:36}} source={require('../assets/profilePurple.png')}/>
                            <View style={{marginLeft:10}}>
                                <Text style={{fontFamily:'bold',fontSize:13}}><Text>{item.receiver === user.user.username ? item.sender : item.receiver}</Text></Text>
                                <Text style={{fontFamily:'regular',fontSize:10,color:'#9C9C9C'}}>Здравствуйте! Меня интересует ваше объявление ...</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }) :

                <Text style={{alignSelf:'center',fontSize:15,fontWeight:'medium',marginTop:100,color:'#aaa'}}>Сообщений нет</Text>
        
            }
        </View>
    );
  }
