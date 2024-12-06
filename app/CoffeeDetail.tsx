import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    FlatList,
    ImageBackground,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ShoppingBasket } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

interface Coffee {
    id: string;
    title: string;
    description: string;
    ingredients: string[];
    image: string;
    type: string;
}

export default function CoffeeDetail() {
    const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
    const [coffee, setCoffee] = useState<Coffee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the coffee details from the API
    useEffect(() => {
        const fetchCoffeeDetails = async () => {
            if (!id) {
                setError('Missing coffee ID.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://sampleapis.assimilate.be/coffee/${type}/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const coffeeData: Coffee = await response.json();
                setCoffee(coffeeData);

                // Save coffee to recently viewed list in AsyncStorage
                const storedCoffees = await AsyncStorage.getItem('recentlyViewed');
                let recentlyViewed = storedCoffees ? JSON.parse(storedCoffees) : [];

                // Avoid duplicates: check if the coffee is already in the list
                const isAlreadyViewed = recentlyViewed.some((item: Coffee) => item.id === coffeeData.id);
                if (!isAlreadyViewed) {
                    recentlyViewed = [coffeeData, ...recentlyViewed]; // Add to the top
                    if (recentlyViewed.length > 3) {
                        recentlyViewed.pop();  // Remove the oldest coffee (keep the list size to 3)
                    }
                }
                // Save the updated list back to AsyncStorage
                await AsyncStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));





            } catch (error) {
                console.error('Error fetching coffee details:', error);
                setError('Failed to load coffee details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCoffeeDetails();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B4513" />
                <Text style={styles.loadingText}>Loading coffee details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!coffee) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Coffee details not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: coffee.image }} // Use the API's image URL as the background
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.7 }} // Optional, for opacity effect
            >
                {/* The background will take up 3/4 of the screen */}
            </ImageBackground>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{coffee.title}</Text>
                <Text style={styles.description}>{coffee.description}</Text>

                <Text style={styles.ingredientsTitle}><ShoppingBasket size={30} color="#654321" />  Ingredients:</Text>
                <FlatList
                    data={coffee.ingredients}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <Text style={styles.ingredientItem}>- {item}</Text>}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 0.50,  // 1/4 of the screen height
        backgroundColor: 'white', // Optional, for clear background below the image
        padding: 20,

    },
    backgroundImage: {
        flex: 0.75,  // 3/4 of the screen height
        resizeMode: 'cover',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: "#654321"
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 125,
        marginBottom: 15,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    description: {
        fontSize: 20,
        textAlign: 'justify',
        color: "#654321",
        marginBottom: 20,
    },
    ingredientsTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#654321"
    },
    ingredientItem: {
        fontSize: 20,
        marginBottom: 5,
        color: "#654321"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
    },
});
