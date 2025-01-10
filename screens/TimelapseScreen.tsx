import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';


export default function TimelapseScreen() {
  const [photos, setPhotos] = useState([]);
  const [timelapseUri, setTimelapseUri] = useState(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@progress_photos');
      if (jsonValue != null) {
        setPhotos(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Erreur lors du chargement des photos', e);
    }
  };

  const generateTimelapse = async () => {
    // Cette fonction est une simulation. Dans une vraie application, vous devriez utiliser
    // une bibliothèque comme react-native-ffmpeg pour générer réellement le timelapse.
    console.log('Génération du timelapse...');
    
    // Simulons l'application d'un filtre sur chaque image
    const filteredPhotos = await Promise.all(photos.map(async (photo) => {
      const filtered = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ brightness: 1.2 }, { contrast: 1.2 }],
        { format: 'jpeg' }
      );
      return filtered.uri;
    }));

    // Dans une vraie implémentation, vous utiliseriez ces URIs filtrées pour créer le timelapse
    console.log('Photos filtrées:', filteredPhotos);

    // Simulons la création d'un timelapse en utilisant la première image comme thumbnail
    if (filteredPhotos.length > 0) {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(
          'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          {
            time: 15000,
          }
        );
        setTimelapseUri(uri);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Génération de Timelapse</Text>
      <Button title="Générer Timelapse" onPress={generateTimelapse} />
      {timelapseUri && (
        <Video
          source={{ uri: timelapseUri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={styles.video}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  video: {
    width: 300,
    height: 300,
  },
});

