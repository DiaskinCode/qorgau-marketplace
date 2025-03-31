import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text,FlatList} from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { useGetPostsByCategoryQuery,useGetPostsByCategoryAndCityQuery } from '../api';


export const GetPostsByCategoryScreen = ({route}) => {
    const [page, setPage] = useState(1);
    const limit = 6;
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState([]);
    const { categoryId, selectedCity } = route.params;
    const [visibleItems, setVisibleItems] = useState([]);

    const viewabilityConfig = {
      itemVisiblePercentThreshold: 50, // Элемент считается видимым, если хотя бы 50% его площади отображается
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
      setVisibleItems(viewableItems.map(item => item.item.id));
    }).current;

    const { data, isLoading, refetch } = selectedCity && selectedCity !== 'Весь Казахстан'
      ? useGetPostsByCategoryAndCityQuery({ category_id: categoryId, city: selectedCity, page, limit })
      : useGetPostsByCategoryQuery({ category_id: categoryId, page, limit });
  
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
      console.log(posts);
      refetch()
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
  
  
    return (
    <FlatList
      data={posts}
      numColumns={2}
      style={{paddingHorizontal:10,marginBottom:100}}
      contentContainerStyle={{justifyContent:'center'}}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      keyExtractor={item => item.id.toString()}
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
      ListEmptyComponent={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#777' }}>Нет постов</Text>
        </View>
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
    );
  };
  