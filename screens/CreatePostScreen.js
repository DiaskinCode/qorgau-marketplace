import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button,TextInput,Pressable, TouchableOpacity, FlatList, ScrollView, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { Video,ResizeMode } from 'expo-av';
import { useGetCategoriesListQuery } from '../api';
import { LinearGradient } from 'expo-linear-gradient';
import { InputMap } from '../components/InputMap';
import { TextInputMask, TextInputMaskMethods } from 'react-native-masked-text';

export const CreatePostScreen = () => {
  const navigation = useNavigation();

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdownId) => {
    setOpenDropdown((prevOpen) => (prevOpen === dropdownId ? null : dropdownId));
  };
  
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState(null);

  const user = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user.id);
  
  const [title, onChangeTitle] = useState('');
  const [cost, onChangeCost] = useState('');
  const [content, onChangeContent] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { data, error, isLoading, refetch } = useGetCategoriesListQuery();
  const [PostAdress,setAdress] = useState('')
  const [AdressLat,setAdressLat] = useState('')
  const [AdressLng,setAdressLng] = useState('')

  const [phone, onChangePhone] = useState('');
  const [whatsapp, onChangeWhatsapp] = useState('');
  const [site, onChangeSite] = useState('');
  const [telegram, onChangeTelegram] = useState('');
  const [insta, onChangeInsta] = useState('');
  const [facebook, onChangeFacebook] = useState('');
  const [tiktok, onChangeTiktok] = useState('');
  const [twogis, onChangeTwogis] = useState('');
  
  const [brand, onChangeBrand] = useState('');
  const [color, onChangeColor] = useState('');
  const [fuel, setFuel] = useState('');
  const [bathroom, setBathroom] = useState('');
  const [statement, setStatement] = useState('');
  const [engineVolume, onChangeEngineVolume] = useState('');
  const [numberOfOwners, onChangeNumberOfOwners] = useState('');
  const [transmission, setTransmission] = useState('');
  const [body, setBody] = useState('');

  const [numberOfRooms, onChangeNumberOfRooms] = useState('');
  const [totalArea, onChangeTotalArea] = useState('');
  const [property, onChangeProperty] = useState('');
  const [furniture, setFurniture] = useState('');
  const [renovation, setRenovation] = useState('');
  const [building, setBuilding] = useState('');
  const [heating, setHeating] = useState('');
  const [house3, onChangeHouse3] = useState('');
  const [rent, onChangeRent] = useState('');
  const [adress, onChangeAdress] = useState('');

  const [city, setCity] = useState('');
  
  // Extra 
  const [selectedCondition, setSelectedCondition] = useState(null);
  
  const handleConditionPress = (condition) => {
    setSelectedCondition(condition);
  };
  
  const [selectedMortage, setSelectedMortage] = useState(null);
  
  const handleMortagePress = (mortage) => {
    setSelectedMortage(mortage);
  };
  
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  
  const handleDeliveryPress = (delivery) => {
    setSelectedDelivery(delivery);
  };
  // 
  
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  
  const togglecategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };
  
  // 

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0]]);

      if(result.assets[0].type == 'video') {
        console.log('play');
        video.current.playAsync()
      }
    }
  };

  const onTapRow = async (details) => {
    setAdress(details.formatted_address)
    setAdressLat(details.geometry.location.lat)
    setAdressLng(details.geometry.location.lng)
    try {
        await AsyncStorage.setItem('PostAdress', JSON.stringify(details.formatted_address));
    } catch (error) {
        
    }
  }

  const sendPostRequest = async () => {
    const apiUrl = 'http://185.129.51.171/api/posts/'; // Replace with your actual API endpoint
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);
    formData.append('categories', category.id);
    formData.append('condition', selectedCondition);
    formData.append('delivery', selectedDelivery);
    formData.append('mortage', selectedMortage);
    formData.append('geolocation', city);
    formData.append('cost', cost);
    formData.append('author', userId);

    formData.append('phone', phone);
    formData.append('phone_whatsapp', whatsapp);
    formData.append('site', site);
    formData.append('telegram', telegram);
    formData.append('insta', insta);
    formData.append('facebook', facebook);
    formData.append('tiktok', tiktok);
    formData.append('twogis', twogis);

    const fieldsData = category.id === 6 ? [
      { field_name: 'Марка', field_value: brand },
      { field_name: 'Цвет', field_value: color },
      { field_name: 'Вид топлива', field_value: fuel },
      { field_name: 'Состояние', field_value: statement },
      { field_name: 'Объём двигателя', field_value: engineVolume },
      { field_name: 'Количество хозяев', field_value: numberOfOwners }
    ] : category.id === 4 ? [
      { field_name: 'Количество комнат', field_value: numberOfRooms },
      { field_name: 'Общая площадь', field_value: totalArea },
      { field_name: 'Ремонт', field_value: renovation },
      { field_name: 'Отопление', field_value: heating },
      { field_name: 'Год постройки', field_value: house3 },
      { field_name: 'Санузел', field_value: bathroom }
    ] : [];

    if (category.id === 4) {
      formData.append('adress', PostAdress);
      formData.append('lat', AdressLat);
      formData.append('lng', AdressLng);
    }
  
    fieldsData.forEach((field, index) => {
      formData.append(`fields[${index}][field_name]`, field.field_name);
      formData.append(`fields[${index}][field_value]`, field.field_value);
    });

    images.forEach((image, index) => {
        formData.append(`images[${index}][image]`, {
            uri: image.uri,
            name: `${index}${image.fileName.toLowerCase()}`,
            type: image,
        });
        formData.append(`images[${index}][type]`, image.type);
    });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization':`Token ${user}`
        },
      });

      if (response.ok) {
        navigation.navigate('PostTariffs');
      } else {
        const errorData = await response.json();
        console.error('Error creating post:', errorData);
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  };

  useEffect(()=>{
    console.log(phone);
    console.log(whatsapp);
  },[phone,whatsapp])

  const CreateDropdown = ({ isOpen, toggleOpen,state, setState, title, placeholder, items }) => { 
    return (
      <>
        <Text style={{ fontFamily:'bold', fontSize:16, marginTop:20, marginBottom:10 }}>{title}</Text>
        <Pressable onPress={toggleOpen} style={styles.profileButton}>
          <Text style={{ fontFamily:'regular', fontSize:14, color:'#96949D' }}>{state ? state : placeholder}</Text>
          <Image style={{ height:16, width:8, transform:[{ rotate: isOpen ? '270deg' : '90deg' }], marginRight:5 }} source={require('../assets/arrow-right.png')} />
        </Pressable>
        {isOpen && (
          <View style={{ backgroundColor:'#F9F6FF', borderEndEndRadius:5, marginTop:-3, borderBottomLeftRadius:5, borderColor:'#675BFB', borderWidth:1, paddingVertical:10 }}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setState(item);
                  toggleOpen();
                }}
                style={{ width:'100%', paddingVertical:10, paddingHorizontal:15 }}>
                <Text style={{ color:'#96949D', fontSize:13 }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </>
    );
  };
  

  return (
    <ScrollView horizontal={false}>
  <View style={{ marginTop: 20,marginBottom:150, width: '90%', alignSelf: 'center' }}>
    <Text style={{ fontSize: 16, fontFamily: 'bold' }}>Добавьте фотографии</Text>
    <ScrollView horizontal={true} contentContainerStyle={{flexDirection:'row',alignItems:'center',marginTop:10,paddingBottom:15}}>
        <TouchableOpacity style={{ marginRight: 10 }} onPress={pickImage}>
            <View style={{ width: 110, height: 110, backgroundColor: '#F9F6FF', borderRadius: 5, borderWidth: 1, borderColor: '#675BFB', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ height: 25, width: 25 }} source={require('../assets/plusBlue.png')} />
            </View>
        </TouchableOpacity>
        <FlatList
        data={images}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
            item.type === 'image' ? <Image source={{ uri: item.uri }} style={{ width: 110, height: 110, borderRadius: 5, borderWidth: 1, borderColor: '#675BFB', marginRight: 10 }} /> :
        
            <View>
                <Video
                isMuted={true}
                ref={video}
                style={{ width: 110, height: 110, borderRadius: 5, borderWidth: 1, borderColor: '#675BFB', marginRight: 10 }}
                source={{
                    uri: item.uri,
                }}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                />
            </View>
        )}
        />
    </ScrollView>
    <Text style={{fontFamily:'bold',fontSize:16,marginTop:10}}>Заголовок</Text>
    <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
        <Text style={{fontFamily:'regular',fontSize:14}}>Введите не менее 16 символов</Text>
        <Text style={{color:'#96949D'}}>{title.length}/70</Text>
    </View>
    <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
        placeholder="Заголовок"
        maxLength={50}
        onChangeText={onChangeTitle} // Pass the callback function
      />
    <Text style={{fontFamily:'bold',fontSize:16,marginBottom:10,marginTop:20,}}>Цена</Text>
    <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
        value={cost}
        onChangeText={onChangeCost}
        placeholder="10 000тг"
        maxLength={70}
    />

    <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Категория</Text>
    <Pressable onPress={togglecategories} style={styles.profileButton}>
      <Text style={{ fontFamily: 'regular', fontSize: 14,color:'#96949D' }}>{category ? category.name : 'Выбор список'}</Text>
      <Image style={{ height: 16, width: 8,transform: [{ rotate: categoriesOpen ? '270deg' : '90deg' }],marginRight: 5 }} source={require('../assets/arrow-right.png')} />
    </Pressable>
    {categoriesOpen && data ? 
        <View style={{backgroundColor: '#F9F6FF',borderEndEndRadius: 5,marginTop:-3,borderBottomLeftRadius: 5,borderColor: '#675BFB',borderWidth: 1,paddingVertical:10}}>
            {data.map((item) => {
            return (
                <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item) {
                      setCategory(item);
                    }
                    togglecategories();
                }}
                style={{ width: '100%', paddingVertical: 10, paddingHorizontal: 15 }}
                >
                <Text style={{ color: '#96949D', fontSize: 13 }}>{item.name}</Text>
                </TouchableOpacity>
            );
            })}
        </View>
    : null}

    <Text style={{fontFamily:'bold',fontSize:16,marginTop:20}}>Придумайте описание</Text>
    <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
        <Text style={{fontFamily:'regular',fontSize:14}}>Введите не менее 40 символов</Text>
        <Text style={{color:'#96949D'}}>{content.length}/9000</Text>
    </View>
    <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 100,
          paddingTop:20,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
        value={content}
        onChangeText={onChangeContent}
        placeholder="Подробно расскажите о вашем товаре или услуге. Какие важные детали нужно знать покупателю?"
        maxLength={9000}
        multiline
        numberOfLines={3}
    />

    <CreateDropdown isOpen={openDropdown === 'city'} toggleOpen={() => toggleDropdown('city')} state={city} setState={setCity} title="Местоположение" placeholder="Выберите город" items={['Астана', 'Алматы', 'Шымкент', 'Кызылорда']} />

    {category && category.id === 3 && (
      <>
        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Марка</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={brand}
          onChangeText={onChangeBrand}
          placeholder="Марка"
          maxLength={70}
        />

        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Цвет</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={color}
          onChangeText={onChangeColor}
          placeholder="Цвет"
          maxLength={70}
        />

        <CreateDropdown isOpen={openDropdown === 'fuel'} toggleOpen={() => toggleDropdown('fuel')} state={fuel} setState={setFuel} title="Вид топлива" placeholder="Выберите вид топлива" items={['Бензин', 'Дизель', 'Электрический', 'Гибридный']} />
        <CreateDropdown isOpen={openDropdown === 'statement'} toggleOpen={() => toggleDropdown('statement')} state={statement} setState={setStatement} title="Состояние" placeholder="Выберите состояние" items={['Новое', 'Б/у']} />
        <CreateDropdown isOpen={openDropdown === 'body'} toggleOpen={() => toggleDropdown('body')} state={body} setState={setBody} title="Тип кузова" placeholder="Выберите тип кузова" items={['Кроссовер', 'Купе','Седан','Хэтчбэк','Лифтбек','Купе','Родстер','Тарга']} />
        <CreateDropdown isOpen={openDropdown === 'transmission'} toggleOpen={() => toggleDropdown('transmission')} state={transmission} setState={setTransmission} title="Коробка передач" placeholder="Выберите коробку передач" items={['Автомат', 'Механика']} />


        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Объём двигателя</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={engineVolume}
          onChangeText={onChangeEngineVolume}
          placeholder="Объём двигателя"
          maxLength={70}
        />
        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Количество хозяев</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={numberOfOwners}
          onChangeText={onChangeNumberOfOwners}
          placeholder="Количество хозяев"
          maxLength={70}
        />
      </>
    )}

    {category && category.id === 6 && (
      <>
        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Марка</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={brand}
          onChangeText={onChangeBrand}
          placeholder="Марка"
          maxLength={70}
        />

        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Цвет</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={color}
          onChangeText={onChangeColor}
          placeholder="Цвет"
          maxLength={70}
        />

        <CreateDropdown isOpen={openDropdown === 'fuel'} toggleOpen={() => toggleDropdown('fuel')} state={fuel} setState={setFuel} title="Вид топлива" placeholder="Выберите вид топлива" items={['Бензин', 'Дизель', 'Электрический', 'Гибридный']} />
        <CreateDropdown isOpen={openDropdown === 'statement'} toggleOpen={() => toggleDropdown('statement')} state={statement} setState={setStatement} title="Состояние" placeholder="Выберите состояние" items={['Новое', 'Б/у']} />


        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Объём двигателя</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={engineVolume}
          onChangeText={onChangeEngineVolume}
          placeholder="Объём двигателя"
          maxLength={70}
        />
        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Количество хозяев</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={numberOfOwners}
          onChangeText={onChangeNumberOfOwners}
          placeholder="Количество хозяев"
          maxLength={70}
        />
      </>
    )}

    {category && category.id === 4 && (
      <>
        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Количество комнат</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={numberOfRooms}
          onChangeText={onChangeNumberOfRooms}
          placeholder="Количество комнат"
          maxLength={70}
        />

        <InputMap 
          label={'Адрес дома'}
          placeholder='Введите адрес' 
          keyboardType="default"
          value={adress}
          onChangeText={(value) => onChangeAdress(value)}
          onTapRow={(details) => onTapRow(details)}/>

        
        <CreateDropdown isOpen={openDropdown === 'property'} toggleOpen={() => toggleDropdown('property')} state={property} setState={onChangeProperty} title="Тип собственности" placeholder="Выберите тип собственности" items={['От хозяина','Долевая']} />
        <CreateDropdown isOpen={openDropdown === 'furniture'} toggleOpen={() => toggleDropdown('furniture')} state={furniture} setState={setFurniture} title="Мебелирование" placeholder="Выберите мебелирование" items={['Полное', 'Частичное', 'Нет']} />
        <CreateDropdown isOpen={openDropdown === 'building'} toggleOpen={() => toggleDropdown('building')} state={building} setState={setBuilding} title="Тип строения" placeholder="Выберите тип строения" items={['Кирпичный', 'Панельный']} />
        
        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Общая площадь</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={totalArea}
          onChangeText={onChangeTotalArea}
          placeholder="Общая площадь"
          maxLength={70}
        />

        <CreateDropdown isOpen={openDropdown === 'renovation'} toggleOpen={() => toggleDropdown('renovation')} state={renovation} setState={setRenovation} title="Ремонт" placeholder="Выберите ремонт" items={['Евроремонт', 'Частичный', 'Белый каркас', 'Черный каркас']} />
        <CreateDropdown isOpen={openDropdown === 'heating'} toggleOpen={() => toggleDropdown('heating')} state={heating} setState={setHeating} title="Отопление" placeholder="Выберите отопление" items={['Воздушное', 'Электрическое ', 'Водяное', 'Центральный']} />
        <CreateDropdown isOpen={openDropdown === 'bathroom'} toggleOpen={() => toggleDropdown('bathroom')} state={bathroom} setState={setBathroom} title="Санузел" placeholder="Выберите санузел" items={['Раздельный', 'Совместный']} />

        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Год постройки</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={house3}
          onChangeText={onChangeHouse3}
          placeholder="Год постройки"
          maxLength={70}
        />
      </>
    )}
    {category && category.id === 5 && (
      <>
        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Количество комнат</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={numberOfRooms}
          onChangeText={onChangeNumberOfRooms}
          placeholder="Количество комнат"
          maxLength={70}
        />

        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Срок аренды</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={rent}
          onChangeText={onChangeRent}
          placeholder="Срок аренды"
          maxLength={70}
        />
        
        <CreateDropdown isOpen={openDropdown === 'property'} toggleOpen={() => toggleDropdown('property')} state={property} setState={onChangeProperty} title="Тип собственности" placeholder="Выберите тип собственности" items={['От хозяина','Долевая']} />
        <CreateDropdown isOpen={openDropdown === 'furniture'} toggleOpen={() => toggleDropdown('furniture')} state={furniture} setState={setFurniture} title="Мебелирование" placeholder="Выберите мебелирование" items={['Полное', 'Частичное', 'Нет']} />
        <CreateDropdown isOpen={openDropdown === 'building'} toggleOpen={() => toggleDropdown('building')} state={building} setState={setBuilding} title="Тип строения" placeholder="Выберите тип строения" items={['Кирпичный', 'Панельный']} />
        
        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Общая площадь</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={totalArea}
          onChangeText={onChangeTotalArea}
          placeholder="Общая площадь"
          maxLength={70}
        />

        <CreateDropdown isOpen={openDropdown === 'renovation'} toggleOpen={() => toggleDropdown('renovation')} state={renovation} setState={setRenovation} title="Ремонт" placeholder="Выберите ремонт" items={['Евроремонт', 'Частичный', 'Белый каркас', 'Черный каркас']} />
        <CreateDropdown isOpen={openDropdown === 'heating'} toggleOpen={() => toggleDropdown('heating')} state={heating} setState={setHeating} title="Отопление" placeholder="Выберите отопление" items={['Воздушное', 'Электрическое ', 'Водяное', 'Центральный']} />
        <CreateDropdown isOpen={openDropdown === 'bathroom'} toggleOpen={() => toggleDropdown('bathroom')} state={bathroom} setState={setBathroom} title="Санузел" placeholder="Выберите санузел" items={['Раздельный', 'Совместный']} />

        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20,marginBottom:10}}>Год постройки</Text>
        <TextInput
        style={{
          width: '100%',
          paddingHorizontal: 10,
          height: 50,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#675BFB',
          backgroundColor: '#F9F6FF'
        }}
          value={house3}
          onChangeText={onChangeHouse3}
          placeholder="Год постройки"
          maxLength={70}
        />
      </>
    )}

<Text style={{fontFamily:'bold',fontSize:16,marginTop:20,}}>Контактные данные</Text>
    <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
      <View style={{width:'48%',marginTop:10}}>
        <Text style={{fontFamily:'medium',opacity:.7,fontSize:12,marginBottom:10,}}>Номер телефона</Text>
        <TextInputMask
          type={'custom'}
          placeholder="+7 777 777 777"
          style={{
            width: '100%',
            paddingHorizontal: 10,
            height: 50,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#675BFB',
            backgroundColor: '#F9F6FF'
          }}
          options={{
            mask: '+79999999999'
          }}
          value={phone}
          onChangeText={onChangePhone}
        />
      </View>
      <View style={{width:'48%',marginTop:10}}>
        <Text style={{fontFamily:'medium',opacity:.7,fontSize:12,marginBottom:10,}}>Номер телефона Whatsapp</Text>
        <TextInputMask
          type={'custom'}
          placeholder="777 777 7777"
          style={{
            width: '100%',
            paddingHorizontal: 10,
            height: 50,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#675BFB',
            backgroundColor: '#F9F6FF'
          }}
          options={{
            mask: '+79999999999'
          }}
          value={whatsapp}
          onChangeText={onChangeWhatsapp}
        />
      </View>
      <View style={{width:'48%',marginTop:10}}>
        <Text style={{fontFamily:'medium',opacity:.7,fontSize:12,marginBottom:10,}}>Ссылка на сайт</Text>
        <TextInput
          placeholder="https://"
          style={{
            width: '100%',
            paddingHorizontal: 10,
            height: 50,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#675BFB',
            backgroundColor: '#F9F6FF'
          }}
          value={site}
          onChangeText={onChangeSite}
        />
      </View>
      <View style={{width:'48%',marginTop:10}}>
        <Text style={{fontFamily:'medium',opacity:.7,fontSize:12,marginBottom:10,}}>Ссылка на телеграм</Text>
        <TextInput
          placeholder="https://t.me/"
          style={{
            width: '100%',
            paddingHorizontal: 10,
            height: 50,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#675BFB',
            backgroundColor: '#F9F6FF'
          }}
          value={telegram}
          onChangeText={onChangeTelegram}
        />
      </View>
      <View style={{width:'48%',marginTop:10}}>
        <Text style={{fontFamily:'medium',opacity:.7,fontSize:12,marginBottom:10,}}>Ссылка на TikTok</Text>
        <TextInput
          placeholder="https://tiktok.com/@"
          style={{
            width: '100%',
            paddingHorizontal: 10,
            height: 50,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#675BFB',
            backgroundColor: '#F9F6FF'
          }}
          value={tiktok}
          onChangeText={onChangeTiktok}
        />
      </View>
      <View style={{width:'48%',marginTop:10}}>
        <Text style={{fontFamily:'medium',opacity:.7,fontSize:12,marginBottom:10,}}>Ссылка на FaceBook</Text>
        <TextInput
          placeholder="https://facebook.com/"
          style={{
            width: '100%',
            paddingHorizontal: 10,
            height: 50,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#675BFB',
            backgroundColor: '#F9F6FF'
          }}
          value={facebook}
          onChangeText={onChangeFacebook}
        />
      </View>
      <View style={{width:'48%',marginTop:10}}>
        <Text style={{fontFamily:'medium',opacity:.7,fontSize:12,marginBottom:10,}}>Ссылка на Instagram</Text>
        <TextInput
          placeholder="https://instagram.com/"
          style={{
            width: '100%',
            paddingHorizontal: 10,
            height: 50,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#675BFB',
            backgroundColor: '#F9F6FF'
          }}
          value={insta}
          onChangeText={onChangeInsta}
        />
      </View>
      <View style={{width:'48%',marginTop:10}}>
        <Text style={{fontFamily:'medium',opacity:.7,fontSize:12,marginBottom:10,}}>Ссылка на 2gis</Text>
        <TextInput
          placeholder="https://2gis.kz/"
          style={{
            width: '100%',
            paddingHorizontal: 10,
            height: 50,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#675BFB',
            backgroundColor: '#F9F6FF'
          }}
          value={twogis}
          onChangeText={onChangeTwogis}
        />
      </View>
    </View>
        <Text style={{fontFamily:'bold',fontSize:16,marginTop:20}}>Дополнительная информация</Text>
        <Text style={{marginVertical:10}}>Состояние товара</Text>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
                onPress={() => handleConditionPress('Новый')}
                style={{
                paddingVertical: 15,
                width: 170,
                backgroundColor: selectedCondition === 'Новый' ? '#675BFB' : '#F9F6FF',
                borderRadius: 5,
                alignItems: 'center',
                borderColor: '#675BFB',
                borderWidth: 1,
                }}
            >
                <Text style={{ color: selectedCondition === 'Новый' ? '#F9F6FF' : '#675BFB', fontSize: 16 }}>Новый</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleConditionPress('Б/У')}
                style={{
                marginLeft: 10,
                paddingVertical: 15,
                width: 170,
                backgroundColor: selectedCondition === 'Б/У' ? '#675BFB' : '#F9F6FF',
                borderRadius: 5,
                alignItems: 'center',
                borderColor: '#675BFB',
                borderWidth: 1,
                }}
            >
                <Text style={{ color: selectedCondition === 'Б/У' ? '#F9F6FF' : '#675BFB', fontSize: 16 }}>Б/У</Text>
            </TouchableOpacity>
        </View>

        <Text style={{marginVertical:10}}>Имеется ли рассрочка?</Text>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
                onPress={() => handleMortagePress(false)}
                style={{
                paddingVertical: 15,
                width: 170,
                backgroundColor: selectedMortage === false ? '#675BFB' : '#F9F6FF',
                borderRadius: 5,
                alignItems: 'center',
                borderColor: '#675BFB',
                borderWidth: 1,
                }}
            >
                <Text style={{ color: selectedMortage === false ? '#F9F6FF' : '#675BFB', fontSize: 16 }}>Нет</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleMortagePress(true)}
                style={{
                marginLeft: 10,
                paddingVertical: 15,
                width: 170,
                backgroundColor: selectedMortage === true ? '#675BFB' : '#F9F6FF',
                borderRadius: 5,
                alignItems: 'center',
                borderColor: '#675BFB',
                borderWidth: 1,
                }}
            >
                <Text style={{ color: selectedMortage === true ? '#F9F6FF' : '#675BFB', fontSize: 16 }}>Да</Text>
            </TouchableOpacity>
        </View>
        

        <Text style={{marginVertical:10}}>Возможна доставка?</Text>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
                onPress={() => handleDeliveryPress(false)}
                style={{
                paddingVertical: 15,
                width: 170,
                backgroundColor: selectedDelivery === false ? '#675BFB' : '#F9F6FF',
                borderRadius: 5,
                alignItems: 'center',
                borderColor: '#675BFB',
                borderWidth: 1,
                }}
            >
                <Text style={{ color: selectedDelivery === false ? '#F9F6FF' : '#675BFB', fontSize: 16 }}>Нет</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleDeliveryPress(true)}
                style={{
                marginLeft: 10,
                paddingVertical: 15,
                width: 170,
                backgroundColor: selectedDelivery === true ? '#675BFB' : '#F9F6FF',
                borderRadius: 5,
                alignItems: 'center',
                borderColor: '#675BFB',
                borderWidth: 1,
                }}
            >
                <Text style={{ color: selectedDelivery === true ? '#F9F6FF' : '#675BFB', fontSize: 16 }}>Да</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={sendPostRequest} style={{ borderRadius: 5, overflow: 'hidden', marginBottom: 20,marginTop:40 }}>
                <LinearGradient
                  colors={['#F3B127', '#F26D1D']}
                  style={{ paddingVertical: 15, width: '100%', alignItems: 'center' }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <Text style={{ color: '#F9F6FF', fontSize: 16 }}>Опубликовать</Text>
                </LinearGradient>
              </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
    profileButton: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#F9F6FF',
      borderRadius: 5,
      borderColor: '#675BFB',
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 17,
    },
  });
  
