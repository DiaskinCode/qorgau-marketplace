import { useNavigation } from '@react-navigation/native';
import React,{useState} from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { Image } from 'expo-image';


export const ProfileMainScreen = () => {
    const user = useSelector(state => state.auth.user);
    const navigation = useNavigation()
    const [isImageLoading, setImageLoading] = useState(true);
    return (
      <ScrollView>
          <View horizontal={false} style={{paddingBottom:110,paddingTop:20,width:'90%',alignSelf:'center'}}>
            <View style={{flexDirection:'row',alignItems:'center',marginBottom:20}}>
            {isImageLoading && <ActivityIndicator style={{ position: 'absolute', width: 170, height: 170 }} />}
            <Image 
              style={{height: 110, width: 110, borderRadius: 150, marginRight: 15}}
              source={
                user.profile_image
                  ? {uri: `http://185.129.51.171${user.profile_image}`}
                  : require('../assets/profilePurple.png')
              }
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
              <View>
                <Text style={{fontSize:16,fontFamily:'bold',marginBottom:10}}>{user.username}</Text>
                <Text style={{fontSize:14,fontFamily:'regular',marginBottom:10}}>{user.email}</Text>
                <TouchableOpacity onPress={()=>{navigation.navigate('ProfileSettings')}} style={{flexDirection:'row'}}>
                  <Image style={{width:16,height:16}} source={require('../assets/profile_settings.png')} />
                  <Text style={{fontSize:14,fontFamily:'regular',marginLeft:6}}>настройки профиля</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={()=>{navigation.navigate('Favourite')}} style={{position:'absolute',right:10,top:10}}>
                  <Image style={{width:25,height:25}} source={require('../assets/starOrange.png')} />
                </TouchableOpacity>
            </View>
            {user.username === 'admin' ?
            <TouchableOpacity onPress={()=>{navigation.navigate('admin')}} style={styles.profileButton}>
              <Text style={{fontFamily:'bold',fontSize:16,opacity:.8}}>Админ панель</Text>
              <Image style={{height:16,width:8}} source={require('../assets/arrow-right.png')} />
            </TouchableOpacity> : null
            }
            <Text style={{fontSize:24,fontFamily:'bold',marginTop:10,marginBottom:20}}>Мои объявления</Text>
            <TouchableOpacity onPress={()=>{navigation.navigate('active')}} style={styles.profileButton}>
              <Text style={{fontFamily:'bold',fontSize:16,opacity:.8}}>Активные</Text>
              <Image style={{height:16,width:8}} source={require('../assets/arrow-right.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('notactive')}} style={styles.profileButton}>
              <Text style={{fontFamily:'bold',fontSize:16,opacity:.8}}>Не активные</Text>
              <Image style={{height:16,width:8}} source={require('../assets/arrow-right.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('notpayed')}} style={styles.profileButton}>
              <Text style={{fontFamily:'bold',fontSize:16,opacity:.8}}>Не оплаченные</Text>
              <Image style={{height:16,width:8}} source={require('../assets/arrow-right.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('deleted')}} style={styles.profileButton}>
              <Text style={{fontFamily:'bold',fontSize:16,opacity:.8}}>Удаленные</Text>
              <Image style={{height:16,width:8}} source={require('../assets/arrow-right.png')} />
            </TouchableOpacity>

            <Text style={{fontSize:24,fontFamily:'bold',marginTop:10,marginBottom:20}}>Другое</Text>
            <TouchableOpacity onPress={()=>{navigation.navigate('tariffs')}} style={styles.profileButton}>
              <Text style={{fontFamily:'bold',fontSize:16,opacity:.8}}>Тарифы</Text>
              <Image style={{height:16,width:8}} source={require('../assets/arrow-right.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('Terms')}} style={styles.profileButton}>
              <Text style={{fontFamily:'bold',fontSize:16,opacity:.8}}>Условия пользования</Text>
              <Image style={{height:16,width:8}} source={require('../assets/arrow-right.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('Policy')}} style={styles.profileButton}>
              <Text style={{fontFamily:'bold',fontSize:16,opacity:.8}}>Политика конфиденциальности</Text>
              <Image style={{height:16,width:8}} source={require('../assets/arrow-right.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('about')}} style={styles.profileButton}>
              <Text style={{fontFamily:'bold',fontSize:16,opacity:.8}}>О приложении</Text>
              <Image style={{height:16,width:8}} source={require('../assets/arrow-right.png')} />
            </TouchableOpacity>
          </View>
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    profileButton: {
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-between',
      backgroundColor:'#fafafa',
      borderRadius:15,
      borderColor:'#675BFB',
      borderWidth:1,
      paddingHorizontal:20,
      paddingVertical:20,
      marginBottom:10
    },
  });
