import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function BodyFatScreen() {
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [height, setHeight] = useState('');
  const [bodyFat, setBodyFat] = useState(null);
  const [bodyFatHistory, setBodyFatHistory] = useState([]);

  const calculateBodyFat = () => {
    // Formule US Navy pour les hommes (ajustez pour les femmes si nécessaire)
    const bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(parseFloat(waist) - parseFloat(neck)) + 0.15456 * Math.log10(parseFloat(height))) - 450;
    setBodyFat(bodyFatPercentage.toFixed(2));
    setBodyFatHistory([...bodyFatHistory, bodyFatPercentage]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calcul du pourcentage de graisse corporelle</Text>
      <TextInput
        style={styles.input}
        placeholder="Tour de taille (cm)"
        keyboardType="numeric"
        value={waist}
        onChangeText={setWaist}
      />
      <TextInput
        style={styles.input}
        placeholder="Tour de cou (cm)"
        keyboardType="numeric"
        value={neck}
        onChangeText={setNeck}
      />
      <TextInput
        style={styles.input}
        placeholder="Taille (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <Button title="Calculer" onPress={calculateBodyFat} />
      {bodyFat && <Text style={styles.result}>Pourcentage de graisse corporelle : {bodyFat}%</Text>}
      
      {bodyFatHistory.length > 0 && (
        <LineChart
          data={{
            labels: bodyFatHistory.map((_, index) => `Semaine ${index + 1}`),
            datasets: [{ data: bodyFatHistory }],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
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
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

