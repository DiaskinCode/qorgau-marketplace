import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/authActions';
import { persistor } from '../store/index';
import { ProductCard } from '../components/ProductCard';
import { useFocusEffect } from '@react-navigation/native';
import { useListFavouritesQuery } from '../api'; // Assuming this is your RTK Query hook for fetching favourites

export const ProfileFavouriteScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: favouritesData, isLoading, isFetching, refetch } = useListFavouritesQuery();
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ marginTop: 0 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ paddingTop: 10,flexDirection:'row',flexWrap:'wrap',width:'93%',alignSelf:'center' }}>
        {favouritesData?.length > 0 ? (
          favouritesData.map((item, index) => (
            <ProductCard
              key={index}
              id={item.id}
              title={item.title}
              image={item.images[0]?.image} // Adjust according to your data structure
              cost={item.cost}
              media={item.images} // Assuming media structure is similar
              condition={item.condition}
              mortage={item.mortage}
              delivery={item.delivery}
              city={item.geolocation}
              date={item.date}
            />
          ))
        ) : (
          <Text style={{ alignSelf: 'center', fontFamily: 'medium', marginTop: 100, fontSize: 20, color: '#96949D',textAlign:'center',width:'100%' }}>Пусто</Text>
        )}
      </View>
    </ScrollView>
  );
};