import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { View, FlatList, RefreshControl,StyleSheet,Modal, Alert, Image,TouchableOpacity,ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCity } from '../actions/locationActions';
import { ReelsCard } from '../components/ReelsCard';
import { useNavigation } from '@react-navigation/native';

export const ReelsMainScreen = () => {
  const navigation = useNavigation()
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const user = useSelector(state => state.auth.token);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllKazakhstan, setIsAllKazakhstan] = useState(true);

  const cityFromRedux = useSelector(state => state.city.selectedCity);
  const [selectedCity, setSelectedCity] = useState('Весь Казахстан');

  const limit = 2;
  const [visible, setVisible] = useState(false);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  });

  const fetchPosts = useCallback(async (requestedPage, city = cityFromRedux) => {
    if (!hasMore && requestedPage !== 1 && city != 'Весь Казахстан') return; // Exit if there are no more pages and not requesting the first page

    setIsLoading(true);
    let url = `http://185.129.51.171/api/posts/?page=${requestedPage}&page_size=${limit}`;
  
    // Add city to the query if it's not "Весь Казахстан"
    if (city !== 'Весь Казахстан') {
      url = `http://185.129.51.171/api/posts_city/?page=${requestedPage}&page_size=${limit}&city=${encodeURIComponent(city)}`;
    }
    
    console.log(url);
    console.log(city);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization':`Token ${user}`
        },
      });
      const data = await response.json();
  
      if (data && data.results && data.results.length) {
        setPosts(requestedPage === 1 ? data.results : prevPosts => [...prevPosts, ...data.results]);
        setPage(requestedPage);
        setHasMore(!!data.next);
      } else {
        if(requestedPage === 1) {
          setPosts([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert('Ошибка', 'Произошла ошибка при загрузке данных');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [hasMore, limit, user]);
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => setVisible(true)}
          style={{ marginRight: 15 }}>
          <Image 
            source={require('../assets/geo.png')} // Иконка локации
            style={{ width: 24, height: 24,marginTop:5 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (cityFromRedux !== 'Весь Казахстан') {
      fetchPosts(1, cityFromRedux);
    } else {
      fetchPosts(1);
    }
  }, [cityFromRedux]);

  useEffect(()=>{
    setSelectedCity(cityFromRedux);
    console.log('CHANGA');
    setIsAllKazakhstan(cityFromRedux === 'Весь Казахстан');
  },[cityFromRedux])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true); // Сбрасываем наличие страниц
    fetchPosts(1);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPosts(page + 1);
    }
  }, [isLoading, hasMore, page, fetchPosts]);

  const [viewableItems, setViewableItems] = useState([]);

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    const visibleIds = viewableItems.map(item => item.item.id.toString());
    setViewableItems(visibleIds);
  }).current;
  
  const flatListRef = useRef();

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    console.log(city); // Debugging
    dispatch(setCity(city));
    setIsAllKazakhstan(city === 'Весь Казахстан');
    setPage(1);
    setPosts([]);
    setHasMore(true); // Assume there's more data to fetch
    fetchPosts(1, city); // Fetch new posts for the selected city
  };
  
  
  
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

  const renderItem = ({ item }) => (
    <ReelsCard
      id={item.id}
      title={item.title}
      image={item.images[0].image}
      cost={item.cost}
      media={item.images}
      condition={item.condition}
      mortage={item.mortage}
      delivery={item.delivery}
      content={item.content}
      city={item.geolocation}
      date={item.date}
      tariff={item.tariff}
      isVisible={viewableItems.includes(item.id.toString())}
    />
  ); 
  
  return (
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
      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={670}
        decelerationRate={.5}
        pagingEnabled
        onEndReached={loadMore}
        onEndReachedThreshold={0.1} 
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: '5%' }}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        style={{ marginBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} scrollEventThrottle={1000}/>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 16, color: 'grey' }}>В этом городе нет постов</Text>
            <TouchableOpacity
              activeOpacity={1}
              style={{marginTop:40}}
              onPressOut={() => setVisible(false)}>
                      <TouchableOpacity
                        style={[
                          styles.сityButton
                        ]}
                        onPress={() => {handleSelectCity('Весь Казахстан')}}
                      >
                        <Text style={styles.cityText}>Перейти на весь Казахстан</Text>
                      </TouchableOpacity>
              </TouchableOpacity>
          </View>
        }
      />
    </>
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