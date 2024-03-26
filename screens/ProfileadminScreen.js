import { useNavigation } from '@react-navigation/native';
import React, { useState,useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Text } from 'react-native';

export const ProfileadminScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({ user_count: 0, post_count: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
      try {
          const response = await fetch('http://185.129.51.171/api/stats/');
          const data = await response.json();
          setStats(data);
      } catch (error) {
          console.error("Failed to fetch stats:", error);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      fetchStats();
  }, []);

  return (
    <ScrollView>
      <View style={{width:'90%',alignSelf:'center',marginTop:20,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
        <Image style={{alignSelf:'center',width:"100%",height:100,objectFit:'contain',marginBottom:60}} source={require('../assets/profileLogo.png')}/>
        <View style={{width:'48%',backgroundColor:'#F9F6FF',borderRadius:20,padding:20}}>
          <Text style={{fontFamily:'medium',fontSize:40}}>{stats.user_count}</Text>
          <Text style={{fontFamily:'medium',fontSize:16,marginTop:10}}>Пользователей</Text>
        </View>
        <TouchableOpacity onPress={() => {navigation.navigate('approve')}} style={{width:'48%',backgroundColor:'#F9F6FF',borderRadius:20,padding:20}}>
          <Text style={{fontFamily:'medium',fontSize:40}}>{stats.post_count}</Text>
          <Text style={{fontFamily:'medium',fontSize:16,marginTop:10}}>объявлений</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9F6FF',
    borderRadius: 5,
    borderColor: '#675BFB',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 17,
    marginBottom: 10,
  },
});
