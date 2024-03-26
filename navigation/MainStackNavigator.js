import React, { Component,useState,useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {HomeScreen} from '../screens/MainScreen'
import { PostViewScreen } from '../screens/PostViewScreen';
import { ResultsSearchScreen } from '../screens/ResultsSearchScreen';
import { GetPostsByCategoryScreen } from '../screens/GetPostsByCategoryScreen';
import { MapSearchScreen } from '../screens/MapSearchScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { GetPostsByCityScreen } from '../screens/GetPostsByCityScreen';
import { useAddToFavouritesMutation, useRemoveFromFavouritesMutation,useListFavouritesQuery } from '../api';

const Main = createNativeStackNavigator();

export default function MainStackNavigator({ route, navigation }) {
    const postId = route.params?.postId;
    const { data: userFavourites, isLoading: isLoadingFavourites } = useListFavouritesQuery();
    const [isFavourite, setIsFavourite] = useState(false);
    const [addToFavourites, { isLoading: isAdding }] = useAddToFavouritesMutation();
    const [removeFromFavourites, { isLoading: isRemoving }] = useRemoveFromFavouritesMutation();

    useEffect(() => {
        if (userFavourites && !isLoadingFavourites) {
          const isFav = userFavourites.some(fav => fav.id === postId);
          setIsFavourite(isFav);
        }
      }, [userFavourites, isLoadingFavourites, postId]);

      const toggleFavourite = async () => {
        if (isFavourite) {
          await removeFromFavourites(postId);
          setIsFavourite(false);
        } else {
          await addToFavourites(postId);
          setIsFavourite(true);
        }
      };
    

    return (
        <Main.Navigator>
            <Main.Screen 
                name='Home' 
                component={HomeScreen}
                options={() => ({
                    headerShown:false,
                    title: null,
                    contentStyle:{
                        backgroundColor:'#FAFAFF'
                      }
                    })}/>
            <Main.Screen 
                name='ViewPost' 
                component={PostViewScreen}
                options={({ navigation }) => ({
                    contentStyle:{
                        backgroundColor:'#FAFAFF'
                      },
                    headerShadowVisible:false,
                    title: null,
                    headerLeft: () => (
                        <View style={styles.HeaderRight}>
                            <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                        </View>
                    ),
                    headerRight: () => (
                        <View style={styles.HeaderRight}>
                            <HeaderIcon side={'right'} source={require('../assets/share.png')} onPress={() => navigation.goBack()}/>
                            <HeaderIcon side={'right'} source={isFavourite ? require('../assets/starOrange.png') : require('../assets/star.png')} onPress={toggleFavourite}/>
                        </View>
                    ),
                    })}/>
            <Main.Screen 
                name='GetPostsByCity' 
                component={GetPostsByCityScreen}
                options={({ route, navigation }) => ({
                    contentStyle:{
                        backgroundColor:'#FAFAFF'
                      },
                    headerShadowVisible:false,
                    title: route.params.categoryName || 'Поиск по городу',
                    headerLeft: () => (
                        <View style={styles.HeaderRight}>
                            <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                        </View>
                    ),
                    })}/>
            <Main.Screen 
                name='ResultsSearchScreen' 
                component={ResultsSearchScreen}
                options={({ navigation }) => ({
                    contentStyle:{
                        backgroundColor:'#FAFAFF'
                      },
                    headerShadowVisible:false,
                    title: 'Поиск',
                    headerLeft: () => (
                        <View style={styles.HeaderRight}>
                            <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                        </View>
                    ),
                    })}/>
            <Main.Screen 
                name='SearchScreen' 
                component={SearchScreen}
                options={({ navigation }) => ({
                    contentStyle:{
                        backgroundColor:'#FAFAFF'
                      },
                    headerShadowVisible:false,
                    title: 'Поиск',
                    headerLeft: () => (
                        <View style={styles.HeaderRight}>
                            <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                        </View>
                    ),
                    })}/>
            <Main.Screen 
                name='MapSearchScreen' 
                component={MapSearchScreen}
                options={({ navigation }) => ({
                    contentStyle:{
                        backgroundColor:'#FAFAFF'
                      },
                    headerShadowVisible:false,
                    title: 'Поиск',
                    headerLeft: () => (
                        <View style={styles.HeaderRight}>
                            <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                        </View>
                    ),
                    })}/>
            <Main.Screen 
                name='GetPostsByCategory' 
                component={GetPostsByCategoryScreen}
                options={({ route, navigation }) => ({
                    contentStyle:{
                        backgroundColor:'#FAFAFF'
                      },
                    headerShadowVisible:false,
                    title: route.params.categoryName || 'Услуги',
                    headerLeft: () => (
                        <View style={styles.HeaderRight}>
                            <HeaderIcon source={require('../assets/goback.png')} onPress={() => navigation.goBack()}/>
                        </View>
                    ),
                    })}/>
        
        </Main.Navigator>
    )
}
function HeaderIcon(props) {
    return (
    <TouchableOpacity onPress={props.onPress}>
        <Image source={props.source}
        style={props.side !== "right" ? styles.Icon : styles.rightIcon}/>
    </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    Icon: {
        marginLeft: 13,
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    rightIcon: {
        marginLeft: 30,
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    HeaderRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    HeaderTitle: {
        fontFamily: 'bold',
        fontSize: 18
    },
});