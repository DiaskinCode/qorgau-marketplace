import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, Image, Text, Modal, StyleSheet,TouchableOpacity, Platform,FlatList,RefreshControl,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/authActions';
import { persistor } from '../store/index';
import { ProductCard } from '../components/ProductCard';
import { useGetPostListCityQuery } from '../api';
import {
  IOScrollView,
  InView,
} from 'react-native-intersection-observer';


export const GetPostsByCityScreen = ({route}) => {
    const city = route.params.city
    const scrollViewRef = useRef(null);
    const [page, setPage] = useState(1);
    const limit = 6;
    const [refreshing, setRefreshing] = useState(false);
    const { data, isLoading, refetch } = useGetPostListCityQuery({ city, page, limit  });
    const [posts, setPosts] = useState([]);
  
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
  
  
    return (
      <IOScrollView ref={scrollViewRef} horizontal={false} style={{ marginTop: 0, paddingTop: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
        scrollEventThrottle={1000}/>
      }>
        <View>
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