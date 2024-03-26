import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, Image, Text, Modal, StyleSheet,TouchableOpacity, Platform,FlatList,RefreshControl,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/authActions';
import { persistor } from '../store/index';
import { ProductCard } from '../components/ProductCard';
import { useGetPostListQuery } from '../api';
import { useFocusEffect } from '@react-navigation/native';

import {
  IOScrollView,
  InView,
} from 'react-native-intersection-observer';


export const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const [page, setPage] = useState(1);
  const limit = 6;
  const { data, isLoading, refetch } = useGetPostListQuery({ page, limit });
  const [posts, setPosts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const refresh = async () => {
        setRefreshing(true);
        try {
          await refetch();
        } finally {
          setRefreshing(false);
        }
      };

      refresh();
    }, [refetch])
  );

  const cities = [
    { value: 'Алматы' },
    { value: 'Астана' },
    { value: 'Шымкент' },
    { value: 'Караганда' },
    { value: 'Актобе' },
    { value: 'Тараз' },
    { value: 'Павлодар' },
    { value: 'Усть-Каменогорск' },
    { value: 'Семей' },
    { value: 'Атырау' },
    { value: 'Костанай' },
    { value: 'Кызылорда' },
    { value: 'Уральск' },
    { value: 'Петропавловск' },
    { value: 'Актау' },
    { value: 'Темиртау' },
    { value: 'Туркестан' },
  ]

  // City selector
  const [visible, setVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(cities[0]?.value);

  const [refreshing, setRefreshing] = useState(false);
  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
  };
  if(!user) {
    handleLogout()
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('refreshed');
    setPage(1); // Reset to page 1 for refresh
    refetch({ page: 1, limit }).finally(() => setRefreshing(false));
  }, [refetch, limit]);

  const loadMoreItems = useCallback(() => {
      setPage(currentPage => currentPage + 1);
  }, [data?.results?.length, data?.total, isLoading]);

  useEffect(() => {
    refetch()
    const appendNewPosts = (newPosts) => {
      // Only append if newPosts are not empty and have different content
      if (newPosts.length === 0) return;
      const existingPostIds = new Set(posts.map(post => post.id));
      const filteredNewPosts = newPosts.filter(post => !existingPostIds.has(post.id));
      
      if (filteredNewPosts.length > 0) {
        setPosts(currentPosts => [...currentPosts, ...filteredNewPosts]);
      }
    };
  
    if (data?.results) {
      if (page === 1) {
        setPosts(data.results);
      } else {
        appendNewPosts(data.results);
      }
    }
  }, [data, page]);


  const shadowStyle = {
    ...Platform.select({
      ios: {
        shadowColor: "#EEE",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
      },
      android: {
        elevation: 4,
      },
    }),
  };



  return (
    <IOScrollView ref={scrollViewRef} horizontal={false} style={{ marginTop:40, paddingTop: 20 }}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
      scrollEventThrottle={1000}/>
    }>
    <Modal visible={visible} transparent={true}>
    <TouchableOpacity
      style={styles.centeredView}
      activeOpacity={1}
      onPressOut={() => setVisible(false)}>
        <View style={styles.modalView}>
          <ScrollView style={{width:'100%',paddingHorizontal:35}}>
            {cities.map((city) => (
              <TouchableOpacity
                key={city.value}
                style={[
                  styles.cityButton,
                  selectedCity === city.value && styles.activeCityButton
                ]}
                onPress={() => {
                  setSelectedCity(city.value);
                  setVisible(false);
                  navigation.navigate('GetPostsByCity',{city:city.value})
                }}
              >
                <Text style={selectedCity === city.value ? styles.cityTextActive : styles.cityText }>{city.value}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
      <View>
          {/* <TouchableOpacity onPress={handleLogout}><Text>Logout</Text></TouchableOpacity> */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center' }}>
          <View>
            <Text style={{ fontSize: 20, fontFamily: 'medium', marginBottom: 5 }}>Здравствуйте, {user.username}</Text>
            <Text style={{ fontFamily: 'regular', fontSize: 14, color: '#96949D' }}>Давайте посмотрим новые объявления</Text>
          </View>
          <Image style={{ width: 60, height: 48 }} source={require('../assets/logo.jpg')} />
        </View>
        <TouchableOpacity onPress={()=>{navigation.navigate('SearchScreen')}} style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', marginTop: 10, backgroundColor: '#F9F6FF', justifyContent: 'space-between', alignItems: 'center', width: 350, paddingHorizontal: 25, height: 50, borderWidth: 1, borderRadius: 5, borderColor: '#F26F1D' }}>
          <Image style={{ width: 17, height: 17 }} source={require('../assets/search.png')} />
          <Text
            style={{ width: '80%', fontSize: 16,opacity:.5 }}
          >Поиск по каталогу</Text>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Image style={{ width: 18, height: 26 }} source={require('../assets/geo.png')} />
          </TouchableOpacity>
        </TouchableOpacity>
        <Text style={{ fontFamily: 'bold', fontSize: 16, marginTop: 10, marginLeft: '5%' }}>Категории</Text>
        <ScrollView horizontal style={{ paddingBottom: 20, marginTop: 10, width: '90%', alignSelf: 'center' }}>
          <View style={{width:1025}}>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:3,categoryName: "Транспорт"})}} style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:128,objectFit:'contain'}} source={require('../assets/Group 1667.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1685.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1669.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:128,objectFit:'contain'}} source={require('../assets/Group 1670.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1672.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1673.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1674.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1675.png')} /></TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',marginTop:5}}>
              <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:2,categoryName: "Услуги"})}} style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1681.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:128,objectFit:'contain'}} source={require('../assets/Group 1680.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1679.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:128,objectFit:'contain'}} source={require('../assets/Group 1678.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1677.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1676.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1684.png')} /></TouchableOpacity>
              <TouchableOpacity style={{borderRadius:14,overflow:'hidden'}}><Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1683.png')} /></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Text style={{ fontFamily: 'bold', fontSize: 16, marginTop: 10,marginLeft:'5%' }}>Рекомендации</Text>
        <View style={{width:'93%',alignSelf:'center', flexWrap:'wrap',flexDirection:'row', marginTop: 10}}>
          {posts.map((item,index) => (
            <ProductCard
              key={index}
              id={item.id}
              title={item.title}
              image={item.images[0].image}
              cost={item.cost}
              media={item.images}
              condition={item.condition}
              mortage={item.mortage}
              delivery={item.delivery}
              city={item.geolocation}
              date={item.date}
            />
            ))}
        </View>
        <InView style={{height:100}} onChange={(inView) => {
            if (inView) {
                console.log('time to load');
                loadMoreItems();
            }
        }}>
          <ActivityIndicator style={{marginTop:50}} size="medium" color="#0000ff" />
        </InView>
      </View>
    </IOScrollView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width:'90%',
    maxHeight:'60%',
    paddingVertical: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cityButton: {
    paddingVertical: 20,
    marginVertical:5,
    paddingHorizontal: 10,
    borderRadius:15,
    width: '100%', 
    backgroundColor: '#eee',
  },
  activeCityButton: {
    backgroundColor: '#F26F1D',
  },
  cityText: {
    textAlign: 'center',
    fontSize:15,
    fontFamily:'medium',
    opacity:.7
  },
  cityTextActive: {
    textAlign: 'center',
    fontFamily:'medium',
    fontSize:15,
    color:'#FFF'
  },
  selectorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 10,
    backgroundColor: '#ddd',
  },
});