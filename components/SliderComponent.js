// Slider.js
import React,{useRef,useState,useEffect} from 'react';
import { View,ActivityIndicator, Dimensions,FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Video,ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

const ImageLoader = ({ style, source, resizeMode }) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <View style={style}>
      {isLoading && (
        <ActivityIndicator
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,backgroundColor:'#F9F6FF' }}
          size="large"
        />
      )}
      <Image
        style={[style, { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }]}
        source={source}
        resizeMode={resizeMode}
        onLoad={() => setLoading(false)}
      />
    </View>
  );
};

export const SliderComponent = ({ data }) => {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(()=>{
    video.current?.playAsync();
  },[video])

  const renderItem = ({ item }) => {
    if (item.type === 'image') {
      return (
        <ImageLoader
          style={{ width, height: 410 }}
          source={{ uri: item.image }}
          resizeMode="cover"
        />
      );
    } else if (item.type === 'video') {
      return (
        <Video
        isMuted={false}
        ref={video}
        source={{ uri: item.image }}
        style={{ width, height: 410 }}
        resizeMode={ResizeMode.COVER}
        useNativeControls
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      );
    }

    return null; // Handle other types if needed
  };

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      pagingEnabled
      snapToAlignment="center"
      decelerationRate="fast"
      snapToInterval={Dimensions.get('window').width}
    />
  );
};

