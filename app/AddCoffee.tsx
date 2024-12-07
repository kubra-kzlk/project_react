import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; //expo compo image picker: allow users to upload images from their gallery
import { useRouter } from 'expo-router';
import { Images, Coffee, GlassWater, Save } from 'lucide-react-native';

export default function AddCoffee() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [type, setType] = useState<'hot' | 'iced' | null>(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'You need to grant permission to access the media library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Save the image URI
        }
    };

    const saveCoffee = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title for the coffee.');
            return;
        }

        if (!type) {
            Alert.alert('Error', 'Please select the coffee type (Hot or Iced).');
            return;
        }

        const newCoffee = {
            title,
            description,
            ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item !== ''),
            image,
            type,
        };
        // Determine the correct API endpoint based on the coffee type
        const apiUrl = type === 'hot'
            ? 'https://sampleapis.assimilate.be/coffee/hot'
            : 'https://sampleapis.assimilate.be/coffee/iced';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InMxMzI5ODFAYXAuYmUiLCJpYXQiOjE3MzM1OTUzMzJ9.d1AD-vAxkIunSHSzhLk1FfFoe72lhsIEj1Fj4Kc_XKg'
                },
                body: JSON.stringify(newCoffee), // Send the coffee data in the request body
            });

            // Log status and success status of the response
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            const responseBody = await response.json();
            console.log('Response body:', responseBody); // Log the actual response from the API            

            // Check if the request was successful
            if (response.ok && responseBody.id) {
                Alert.alert('Success', 'New coffee added successfully!', [
                    { text: 'OK', onPress: () => router.back() }]);
                router.replace({
                    pathname: '/',
                    params: { id: responseBody.id.toString(), type: newCoffee.type }, // Pass the newly added coffee
                });
            } else {
                Alert.alert('Error', 'Failed to add coffee. Please try again.');
            }
        } catch (error) {
            console.error('Error saving coffee:', error);
            Alert.alert('Error', 'Failed to save coffee. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/images/tr_logo.png')} style={styles.logo} />
            </View>
            <ImageBackground
                source={require('../assets/images/cpus.jpeg')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.4 }}
            >
                <Text style={styles.title}>     Add New Coffee</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ingredients (comma separated)"
                    value={ingredients}
                    onChangeText={setIngredients}
                />

                <Text style={styles.typeTitle}>Select Coffee Type:</Text>
                <View style={styles.radioContainer}>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setType('hot')}
                    >
                        <View style={[styles.radioCircle, type === 'hot' && styles.radioCircleSelected]} />
                        <Text style={styles.radioLabel}><Coffee size={20} color="#402024" />  Hot Coffee </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setType('iced')}
                    >
                        <View style={[styles.radioCircle, type === 'iced' && styles.radioCircleSelected]} />
                        <Text style={styles.radioLabel}><GlassWater size={20} color="#402024" /> Iced Coffee</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={pickImage}>

                    <Text style={styles.typeTitle}>Pick an Image <Images size={20} color="#402024" /></Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <TouchableOpacity style={styles.button} onPress={saveCoffee}>
                    <Text style={styles.buttonText}>Save Coffee <Save size={25} color="#402024" /></Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoContainer: {
        position: 'absolute',
        top: 1,
        left: 1,
        zIndex: 1, // To make sure the logo is on top of other content
    },
    logo: {
        width: 80,
        height: 80,
        marginTop: 11,
        marginLeft: 24,
        resizeMode: 'contain',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    title: {
        marginBottom: 180,
        fontSize: 46,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#402024",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 6,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 8,
    },
    input: {
        height: 40,
        width: '80%',
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 20,
        borderColor: '#402024',
        backgroundColor: '#FFF',
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        elevation: 6,

    },
    typeTitle: {
        alignSelf: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#402024"

    },
    radioContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        marginBottom: 1,

    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,

    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        marginRight: 10,
        borderColor: '#402024',

    },
    radioCircleSelected: {
        backgroundColor: '#402024',
    },
    radioLabel: {
        fontSize: 20,
        color: "#402024"
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center'

    },
    buttonText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "#402024",
        marginBottom: 220,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 35,
        marginHorizontal: 20,
    },

}); 