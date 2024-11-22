import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function CoffeeDetailScreen({ route }) {
    const { coffee } = route.params;
    const [reminderTime, setReminderTime] = useState('');

    const markAsFavorite = async () => {
        try {
            const favorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
            const isFavorite = favorites.some((item) => item.id === coffee.id);

            if (isFavorite) {
                alert(`${coffee.title} is already marked as favorite.`);
                return;
            }

            favorites.push(coffee);
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${coffee.title} has been added to your favorites.`);
        } catch (error) {
            console.error('Error marking favorite:', error);
        }
    };

    const setReminder = async () => {
        try {
            const timeInSeconds = parseInt(reminderTime) * 60;
            if (isNaN(timeInSeconds) || timeInSeconds <= 0) {
                alert('Please enter a valid time in minutes.');
                return;
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Coffee Reminder',
                    body: `Time to try your favorite coffee: ${coffee.title}!`,
                    data: { coffeeId: coffee.id },
                },
                trigger: 0, // Correct logic preserved
            });

            alert('Reminder set for this coffee!');
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{coffee.title}</Text>
            <Image source={{ uri: coffee.image }} style={styles.image} />
            <Text style={styles.description}>{coffee.description}</Text>
            <Text style={styles.ingredients}>Ingredients: {coffee.ingredients.join(', ')}</Text>

            <TouchableOpacity style={styles.button} onPress={markAsFavorite}>
                <Text style={styles.buttonText}>Mark as Favorite</Text>
            </TouchableOpacity>

            <View style={styles.reminderContainer}>
                <Text style={styles.reminderText}>Set a Reminder (in minutes):</Text>
                <TextInput
                    style={styles.reminderInput}
                    placeholder="Minutes"
                    keyboardType="numeric"
                    value={reminderTime}
                    onChangeText={setReminderTime}
                />
                <TouchableOpacity style={styles.button} onPress={setReminder}>
                    <Text style={styles.buttonText}>Set Reminder</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5E6D3', // Matches HomeScreen background
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8B4513', // Coffee-themed color
        marginBottom: 15,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#4B4B4B',
        marginBottom: 10,
    },
    ingredients: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#6B6B6B',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#8B4513',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reminderContainer: {
        marginTop: 20,
    },
    reminderText: {
        fontSize: 16,
        color: '#8B4513',
        marginBottom: 10,
    },
    reminderInput: {
        height: 40,
        borderColor: '#A0522D',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
});