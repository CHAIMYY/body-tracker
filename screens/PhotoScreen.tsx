import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PhotoScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      loadPhotos();
    })();
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

  const savePhoto = async (photo) => {
    try {
      const updatedPhotos = [...photos, photo];
      await AsyncStorage.setItem('@progress_photos', JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);
    } catch (e) {
      console.error('Erreur lors de la sauvegarde de la photo', e);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 300 } }],
        { format: 'jpeg' }
      );
      savePhoto({ uri: resizedPhoto.uri, date: new Date().toISOString() });
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Pas d'accès à la caméra</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={ref => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <Button title="Prendre une photo" onPress={takePicture} />
        </View>
      </Camera>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.photoItem}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            <Text>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  photoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});

