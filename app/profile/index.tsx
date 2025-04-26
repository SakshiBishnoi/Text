import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter

export default function ProfileScreen() {
  const router = useRouter(); // Initialize router

  // Mock user data - replace with actual data fetching later
  const user = {
    name: 'Hasima Medvedova',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    username: '@hasima_m',
    bio: 'Loves donuts 🍩 | React Native Dev | Seeking the best chat UI',
    email: 'hasima.m@example.com',
    phone: '+1 234 567 890',
  };

  const handleEditProfile = () => {
    console.log('Navigate to Edit Profile Screen');
    // Example navigation (replace with actual route if edit screen exists)
    // router.push('/profile/edit'); 
    Alert.alert('Edit Profile', 'Navigation to edit profile screen is not implemented yet.');
  };

  const handleChangeAvatar = () => {
    console.log('Change Avatar pressed');
    // TODO: Add image picker logic
    Alert.alert('Change Avatar', 'Image picker functionality is not implemented yet.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleChangeAvatar} activeOpacity={0.8}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </TouchableOpacity>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>{user.username}</Text>

        <Text style={styles.bio}>{user.bio}</Text>

        {/* User Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Ionicons name="mail-outline" size={20} color="#7c5dfa" style={styles.detailIcon} />
            <Text style={styles.detailText}>{user.email}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={20} color="#7c5dfa" style={styles.detailIcon} />
            <Text style={styles.detailText}>{user.phone}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Keep white background for profile focus
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50, // Increased padding
    paddingHorizontal: 25,
  },
  avatar: {
    width: 130, // Slightly larger avatar
    height: 130,
    borderRadius: 65,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#7c5dfa', // Add border matching primary color
  },
  name: {
    fontSize: 26, // Larger name
    fontWeight: 'bold',
    color: '#222', // Darker color matching chat list
    marginBottom: 5,
  },
  username: {
    fontSize: 17,
    color: '#555', // Consistent subtitle color
    marginBottom: 15,
  },
  bio: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22, // Improve readability
    paddingHorizontal: 10,
  },
  detailsSection: {
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f6fb', // Use light background from chat list
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#7c5dfa', // Use primary color from chat list
    paddingVertical: 14, // Slightly larger button
    paddingHorizontal: 35,
    borderRadius: 30, // More rounded
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 