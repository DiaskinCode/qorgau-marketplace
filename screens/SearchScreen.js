import React, { useState,useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, RefreshControl, Dimensions, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';

import { useGetPostListMapQuery, useSearchPostsQuery } from '../api';
import { ProductCard } from '../components/ProductCard';


export const SearchScreen = () => {
    const [search, onChangeSearch] = useState('');
    const [screen, setScreen] = useState(1);
    const navigation = useNavigation()
    const {height, width} = Dimensions.get('window')
    const [region, setRegion] = useState(null);

    const [viewableItems, setViewableItems] = useState([]);
    const viewabilityConfig = useRef({
      itemVisiblePercentThreshold: 50
    });
  
    const handleViewableItemsChanged = useRef(({ viewableItems }) => {
      setViewableItems(viewableItems.map(item => item.key));
    });

    const { data:PostsOnMap, error, isLoading, refetch } = useGetPostListMapQuery();
    const { data: searchResults,refetch: refetchSearchResults } = useSearchPostsQuery(search);

    useEffect(() => {
        refetch();
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        })();
      }, []);

      useEffect(() => {
        if (search && search.length > 2) {
            refetchSearchResults();
        }
    }, [search]);

    return (
        <View style={{width:'100%',alignItems:'center'}}>
            <View style={{marginTop:20,width:'90%',backgroundColor:'#FFFFFF',borderRadius:15,height:46,flexDirection:'row',position:'relative',zIndex:3}}>
                <TouchableOpacity onPress={() => {setScreen(1)}} style={screen == 1 ? {width:'50%',backgroundColor:'#675BFB',borderRadius:15,justifyContent:'center',alignItems:'center'} : {width:'50%',justifyContent:'center',alignItems:'center'}}><Text style={screen == 1 ? {color:'#fff',fontFamily:'medium',fontSize:16} : {color:'#675BFB',fontFamily:'medium',fontSize:16}}>По названию</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => {setScreen(2)}} style={screen == 2 ? {width:'50%',backgroundColor:'#675BFB',borderRadius:15,justifyContent:'center',alignItems:'center'} : {width:'50%',justifyContent:'center',alignItems:'center'}}><Text style={screen == 2 ? {color:'#fff',fontFamily:'medium',fontSize:16} : {color:'#675BFB',fontFamily:'medium',fontSize:16}}>По карте</Text></TouchableOpacity>
            </View>
            {screen == 1 ?
            <>
                <TouchableOpacity onPress={()=>{navigation.navigate('SearchScreen')}} style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', marginTop: 20, backgroundColor: '#F9F6FF', justifyContent: 'space-between', alignItems: 'center', width: 350, paddingHorizontal: 25, height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#F26F1D' }}>
                <Image style={{ width: 17, height: 17 }} source={require('../assets/search.png')} />
                <TextInput
                    style={{ width: '90%', fontSize: 16 }}
                    onChangeText={onChangeSearch}
                    placeholder="Поиск по каталогу"
                    value={search}
                />
                </TouchableOpacity> 
                <FlatList
                data={searchResults}
                contentContainerStyle={{ paddingBottom: 20, marginBottom: 90, marginTop: 10, justifyContent: 'space-between',width:'100%' }}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <ProductCard
                    id={item.id}
                    title={item.title}
                    key={item.id}
                    image={item.images[0].image}
                    cost={item.cost}
                    media={item.images}
                    condition={item.condition}
                    mortage={item.mortage}
                    delivery={item.delivery}
                    city={item.geolocation}
                    date={item.date}
                    isInView={viewableItems.includes(item.id.toString())}
                    />
                )}
                onViewableItemsChanged={handleViewableItemsChanged.current}
                viewabilityConfig={viewabilityConfig.current}
                />
            </>
            :

            <View style={{width: '100%', height: height,position:'absolute',top:0}}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{width: '100%', height: height}}
                    showsUserLocation={true}
                    initialRegion={region}
                >
                    {PostsOnMap && PostsOnMap.map((post) => (
                        <Marker
                            key={post.id}
                            onPress= {()=>{navigation.navigate('ViewPost',{id:post.id})}}
                            coordinate={{latitude: parseFloat(post.lat), longitude: parseFloat(post.lng)}}
                        />
                    ))}
                </MapView>
            </View>
            }
        </View>
    );
  }
