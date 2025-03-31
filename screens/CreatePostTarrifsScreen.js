import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Button,TextInput,Pressable, TouchableOpacity, FlatList, ScrollView, Image, Text } from 'react-native';

export const CreatePostTarrifsScreen = ({route}) => {
    const {id} = route.params
    const navigation = useNavigation()
    return (
        <View style={{alignSelf:'center',marginTop:0,width:'90%'}}>
            <Image style={{width:100,height:80,alignSelf:'center',marginTop:30,objectFit:'contain'}} source={require('../assets/logo.jpg')} />
            <Text style={{fontSize:24,fontFamily:'bold',textAlign:'center',marginTop:20}}>Выберите тариф</Text>
            <TouchableOpacity onPress={()=>{navigation.navigate('Pay',{tariff:2, id:id})}} style={{borderRadius:5,width:'100%',borderWidth:1,borderColor:'#675BFB',marginTop:20}}>
                <Text style={{textAlign:'center',fontSize:24,fontWeight:'bold',color:'#7C24F1',marginTop:15}}>УНИКАЛЬНЫЙ</Text>
                <Text style={{color:'#96949D',fontSize:14,textAlign:'center',fontFamily:'regular'}}>Ваше объявление будет выделено цветом</Text>
                <Text style={{backgroundColor:'#675BFB',width:'100%',textAlign:'center',paddingVertical:5,marginTop:25,marginBottom:15,fontSize:24,fontWeight:'bold',color:'#F9F6FF'}}>1 500₸</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('Pay',{tariff:1, id:id})}} style={{borderRadius:5,width:'100%',borderWidth:1,borderColor:'#F26F1D',marginTop:20}}>
                <Text style={{textAlign:'center',fontSize:24,fontWeight:'bold',color:'#F26F1D',marginTop:15}}>PRO</Text>
                <Text style={{color:'#96949D',fontSize:14,textAlign:'center',fontFamily:'regular'}}>Ваше объявление будет в первых рядах</Text>
                <Text style={{backgroundColor:'#F26F1D',width:'100%',textAlign:'center',paddingVertical:5,marginTop:25,marginBottom:15,fontSize:24,fontWeight:'bold',color:'#F9F6FF'}}>2 500₸</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('PostCreated')}} style={{borderRadius:5,width:'100%',borderWidth:1,borderColor:'#01A5C8',marginTop:20}}>
                <Text style={{textAlign:'center',fontSize:24,fontWeight:'bold',color:'#01A5C8',marginTop:15}}>Базовый</Text>
                <Text style={{color:'#96949D',fontSize:14,textAlign:'center',fontFamily:'regular'}}>Размещение объявления</Text>
                <Text style={{backgroundColor:'#01A5C8',width:'100%',textAlign:'center',paddingVertical:5,marginTop:25,marginBottom:15,fontSize:24,fontWeight:'bold',color:'#F9F6FF'}}>0₸</Text>
            </TouchableOpacity>
        </View>
    )
}