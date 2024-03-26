import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet,  TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, RefreshControl, Dimensions, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const ReelsCategoriesScreen = () => {

    return (
        <View>
          <Text>Reels</Text>
        </View>
    );
  }
const styles = StyleSheet.create({
    Container: {
        flex:1,
        width:  '86.6%',
        marginHorizontal:'6.4%',
    },
    CategoryBlock: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },

    ContainerArticle: {
        marginBottom: 15,
        marginTop:10,
      },
      Header: {
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems: 'center', 
        marginBottom: 10,
      },
      Title: {
        fontFamily: 'regular',
        fontSize: 18,
      },
      ShowAllButton: {
        fontFamily: 'regular',
        fontSize: 12,
        color: '#D0CDD2'
      },
      ArticleText: {
        fontFamily: 'bold',
        fontSize: 13,
      },
      Image: {
        height: 90, 
        width: '100%', 
        resizeMode: 'cover',
        marginBottom: 7, 
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 6,
      }
})