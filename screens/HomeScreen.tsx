import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  EditProfile: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_profile');
      if (jsonValue != null) {
        setProfile(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Erreur lors du chargement du profil', e);
    }
  };

  const calculateBMI = () => {
    if (profile && profile.weight && profile.height) {
      const heightInMeters = profile.height / 100;
      return (profile.weight / (heightInMeters * heightInMeters)).toFixed(2);
    }
    return 'N/A';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Utilisateur</Text>
      {profile ? (
        <View>
          <Text>Nom: {profile.firstName} {profile.lastName}</Text>
          <Text>Âge: {profile.age}</Text>
          <Text>Nationalité: {profile.nationality}</Text>
          <Text>Poids: {profile.weight} kg</Text>
          <Text>Taille: {profile.height} cm</Text>
          <Text>IMC: {calculateBMI()}</Text>
        </View>
      ) : (
        <Text>Aucun profil trouvé</Text>
      )}
      <Button
        title="Modifier le profil"
        onPress={() => navigation.navigate('EditProfile')}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

