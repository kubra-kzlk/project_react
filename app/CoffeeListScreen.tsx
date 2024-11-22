import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function CoffeeListScreen({ route, navigation }) {
    const { type } = route.params; // 'hot' or 'iced'
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoffees = async () => {
            try {
                const response = await fetch(`https://sampleapis.assimilate.be/coffee/${type}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch coffee data');
                }
                const data = await response.json();
                setCoffees(data);
            } catch (error) {
                console.error('Error fetching coffee data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoffees();
    }, [type]);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#8B4513" />
            ) : (
                <FlatList
                    data={coffees}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.itemContainer}
                            onPress={() => navigation.navigate('CoffeeDetail', { coffee: item })}
                        >
                            <Text style={styles.itemText}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No coffee available.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5E6D3', // Matches the background of the HomeScreen
        padding: 10,
    },
    itemContainer: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // Adds shadow for Android
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8B4513', // Coffee-themed color
    },
    emptyText: {
        textAlign: 'center',
        color: '#8B4513',
        fontStyle: 'italic',
        marginTop: 20,
    },
});
