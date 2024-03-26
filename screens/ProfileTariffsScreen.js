import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TextInput,  TouchableOpacity, FlatList, ScrollView, Image, Text } from 'react-native';




export const ProfileTariffsScreen = () => {
    return (
      <ScrollView>
          <Image style={{width:393,height:852,marginTop:-90}} source={require('../assets/tariffs.png')}/>
      </ScrollView>
    );
  }
