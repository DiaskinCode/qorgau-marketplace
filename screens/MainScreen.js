import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, Image, Text, Modal, StyleSheet,TouchableOpacity, Platform,FlatList,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/authActions';
import { persistor } from '../store/index';
import { ProductCard } from '../components/ProductCard';
import { useGetPostListQuery,useGetPostListCityQuery } from '../api';
import {useTranslation} from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { setCity } from '../actions/locationActions';


export const HomeScreen = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const [page, setPage] = useState(1);
  const limit = 6;
  const selectedCity = useSelector(state => state.city.selectedCity);
  const [isAllKazakhstan, setIsAllKazakhstan] = useState(true);
  const [visibleItems, setVisibleItems] = useState([]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Элемент считается видимым, если хотя бы 50% его площади отображается
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setVisibleItems(viewableItems.map(item => item.item.id));
  }).current;

  const queryArgs = isAllKazakhstan && selectedCity !== 'Весь Казахстан' ? { page, limit } : { city:selectedCity, page, limit };
  const { data, isLoading, refetch } = isAllKazakhstan ? useGetPostListQuery(queryArgs) : useGetPostListCityQuery(queryArgs);

  const handleSelectCity = (city) => {
    dispatch(setCity(city));
    setIsAllKazakhstan(city === 'Весь Казахстан');
    setPage(1);
    setPosts([]); 
    setVisible(false);
    refetch()
  };

  useEffect(()=>{
    setIsAllKazakhstan(selectedCity === 'Весь Казахстан');
    refetch()
  },[selectedCity])

  const [posts, setPosts] = useState([]);


  const cities = [
    { value: 'Весь Казахстан' },
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


  const [visible, setVisible] = useState(false);

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
    setPage(1); // Reset to page 1 for refresh
    refetch({ page: 1, limit }).finally(() => setRefreshing(false));
  }, [refetch, limit]);

  const loadMoreItems = useCallback(() => {
      setPage(currentPage => currentPage + 1);
  }, [data?.results?.length, data?.total, isLoading]);

  useEffect(() => {
    const appendNewPosts = (newPosts) => {
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
    <FlatList
      data={posts}
      numColumns={2}
      style={{marginTop:60,paddingHorizontal:10}}
      contentContainerStyle={{justifyContent:'center'}}
      keyExtractor={item => item.id.toString()}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      ListHeaderComponent={
        <>
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
                onPress={() => {handleSelectCity(city.value)}}
              >
                <Text style={selectedCity === city.value ? styles.cityTextActive : styles.cityText }>{city.value}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center',width: '95%', alignSelf: 'center' }}>
          <View style={{flexDirection: 'row',alignItems:'center'}}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#F26F1D"
            />
            <Text style={{ fontSize: 20, marginLeft:10,fontFamily: 'medium', marginBottom: 5 }}>{user.username}</Text>
          </View>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Image style={{ width: 24, height: 24, marginTop:3 }} source={require('../assets/geo.png')} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={()=>{navigation.navigate('SearchScreen')}} style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', marginTop: 10, backgroundColor: '#F9F6FF', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#eee' }}>
          <Image style={{ width: 17, height: 17 }} source={require('../assets/search.png')} />
          <Text
            style={{ width: '90%', fontSize: 16,opacity:.5 }}
          >{t('main.search_catalog')}</Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: 'bold', fontSize: 16, marginTop: 10, marginLeft: '5%' }}>Категории</Text>
        <ScrollView horizontal style={{ paddingBottom: 20, marginTop: 10, width: '95%', alignSelf: 'center' }}>
          <View style={{width:1025}}>
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:1,categoryName: t('categories.transport'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.transport')}</Text>
              <Image style={{...shadowStyle,height:87,width:128,objectFit:'contain'}} source={require('../assets/Group 1667.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:3,categoryName: t('categories.work'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.work')}</Text>
              <Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1685.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:4,categoryName: t('categories.real_estate'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.real_estate')}</Text>
              <Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1669.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:5,categoryName: t('categories.exchange_free'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.exchange_free')}</Text>
              <Image style={{...shadowStyle,height:87,width:128,objectFit:'contain'}} source={require('../assets/Group 1670.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:6,categoryName: t('categories.electronics'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.electronics')}</Text>
              <Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1672.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:7,categoryName: t('categories.hobbies_sports_recreation'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.hobbies_sports_recreation')}</Text>
              <Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1673.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:8,categoryName: t('categories.childrens_world'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.childrens_world')}</Text>
              <Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1674.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:9,categoryName: t('categories.products'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.products')}</Text>
              <Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1675.png')} />
            </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',marginTop:5}}>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:2,categoryName: t('categories.services'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.services')}</Text>
              <Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1681.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:10,categoryName: t('categories.clothing_shoes'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.clothing_shoes')}</Text>
              <Image style={{...shadowStyle,height:87,width:128,objectFit:'contain'}} source={require('../assets/Group 1680.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:11,categoryName: t('categories.animals'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.animals')}</Text>
              <Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1679.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:12,categoryName: t('categories.home_furniture'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.home_furniture')}</Text>
              <Image style={{...shadowStyle,height:87,width:128,objectFit:'contain'}} source={require('../assets/Group 1678.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:13,categoryName: t('categories.buy'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.buy')}</Text>
              <Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1677.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:14,categoryName: t('categories.garden_plants'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.garden_plants')}</Text>
              <Image style={{...shadowStyle,height:87,width:82,objectFit:'contain'}} source={require('../assets/Group 1676.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:15,categoryName: t('categories.construction_renovation'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.construction_renovation')}</Text>
              <Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1684.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('GetPostsByCategory',{categoryId:16,categoryName: t('categories.design_interior'),selectedCity: selectedCity})}} style={{borderRadius:14,overflow:'hidden',position:'relative'}}>
              <Text style={{fontFamily:'medium',fontSize:10,left:13,top:13,position:'absolute',zIndex:2}}>{t('categories.design_interior')}</Text>
              <Image style={{...shadowStyle,height:87,width:174,objectFit:'contain'}} source={require('../assets/Group 1683.png')} />
            </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Text style={{ fontFamily: 'bold', fontSize: 16, marginTop: 10,marginBottom:10,marginLeft:'5%' }}> {isAllKazakhstan ? 'Рекомендации' : `Рекомендации в городе ${selectedCity}` }</Text>
      </View>
        </>
      }
      renderItem={({ item }) => (
        <View style={{ width: '50%', alignItems: 'center' }}>
          <ProductCard
            key={item.id}
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
            tariff={item.tariff || 0}
            isVisible={visibleItems.includes(item.id)}
          />
        </View>
      )}
      onEndReached={loadMoreItems}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListFooterComponent={isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    />
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