import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Coffee, IceCream, Plus, Heart } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
interface Coffee {
  id: string;
  title: string;
}

type RootStackParamList = {
  Home: undefined;
  CoffeeList: { type: string };
  CoffeeDetail: { coffee: any };
  AddCoffee: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ }: HomeScreenProps) {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const getFavorites = async () => {
    try {                     //to fetch and display user favorites
      const favoritesData = await AsyncStorage.getItem('favorites');
      // If favoritesData is null, fallback to an empty array
      const parsedFavorites = favoritesData ? JSON.parse(favoritesData) : [];
      setFavorites(parsedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getFavorites);
    return unsubscribe;
  }, [navigation]);

  const renderFavoriteItem = ({ item }: { item: Coffee }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => navigation.navigate('CoffeeDetail', { coffee: item })}
    >
      <Heart size={18} color="#8B4513" />
      <Text style={styles.favoriteItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (


    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find the best coffee for you</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CoffeeList', { type: 'hot' })}
        >
          <Coffee size={24} color="#FFF" />
          <Text style={styles.buttonText}>Hot Coffee</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CoffeeList', { type: 'iced' })}
        >
          <IceCream size={24} color="#FFF" />
          <Text style={styles.buttonText}>Iced Coffee</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCoffee')}
      >
        <Plus size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Add New Coffee</Text>
      </TouchableOpacity>
      <View style={styles.favoritesContainer}>
        <Text style={styles.favoritesTitle}>Your Favorites</Text>
        {favorites.length === 0 ? (
          <Text style={styles.noFavorites}>No favorites yet!</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderFavoriteItem}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#A0522D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#A0522D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  favoritesContainer: {
    margin: 20,
  },
  favoritesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 10,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  favoriteItemText: {
    fontSize: 16,
    color: '#8B4513',
    marginLeft: 10,
  },
  noFavorites: {
    fontStyle: 'italic',
    color: '#8B4513',
    textAlign: 'center',
  },
}); 