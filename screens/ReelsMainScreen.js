import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { ReelsCard } from '../components/ReelsCard';
import { useGetPostListQuery } from '../api';
import { useFocusEffect } from '@react-navigation/native';

export const ReelsMainScreen = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const limit = 3
  const { data, isLoading, error, refetch } = useGetPostListQuery({ page,limit });

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  });


  const [viewableItems, setViewableItems] = useState([]);

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    const visibleIds = viewableItems.map(item => item.item.id.toString());
    setViewableItems(visibleIds);
  }).current;
  const flatListRef = useRef();

  useEffect(()=>{
    refetch();
  })

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
        setPosts(data.results); // Reset posts for the first page
      } else {
        appendNewPosts(data.results); // Append new posts checking for duplicates
      }
  
      setTimeout(() => {
        flatListRef.current?.recordInteraction();
      }, 500);
    }
    refetch();
  }, [data, page]);

  const loadMore = useCallback(() => {
    setPage(currentPage => currentPage + 1);
}, [data?.results?.length, data?.total, isLoading]);

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
      isVisible={viewableItems.includes(item.id.toString())}
    />
  );

  return (
    <FlatList
      ref={flatListRef}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      snapToAlignment="start"
      snapToInterval={640}
      decelerationRate="slow"
      pagingEnabled
      onEndReached={loadMore}
      onEndReachedThreshold={0.1} 
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      contentContainerStyle={{ paddingVertical: 20,paddingHorizontal:'5%' }}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig.current}
      style={{marginBottom:100}}
    />
  );
};
