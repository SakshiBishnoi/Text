import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Platform, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

interface SingleChatScreenProps {
  id?: string;
  name?: string;
  avatar?: string;
}

// Accept props for id, name, avatar
export default function SingleChatScreen({ id, name, avatar }: SingleChatScreenProps) {
  const [input, setInput] = useState('');
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const maxContainerWidth = 600;
  const containerStyle = {
    ...styles.container,
    ...(isWeb ? { maxWidth: maxContainerWidth, alignSelf: 'center' as const, width } : { width }),
  };

  // Preload icon fonts
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...Feather.font,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f6fb' }}>
        <ActivityIndicator size="large" color="#7c5dfa" />
      </View>
    );
  }

  // Use props or fallback to default user
  const user = {
    name: name || 'Chris Hemsworth',
    avatar: avatar || 'https://randomuser.me/api/portraits/men/50.jpg',
  };

  const messages = [
    { id: 1, text: 'Hey! How are you?', fromMe: false },
    { id: 2, text: "I'm good, thanks! How about you?", fromMe: true },
    { id: 3, text: 'Doing great! Want to grab some donuts?', fromMe: false },
    { id: 4, text: 'Absolutely! 🍩', fromMe: true },
  ];

  const galleryImages = [
    { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
    { uri: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
    { uri: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f6fb' }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="videocam" size={22} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="call" size={22} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Messages */}
      <ScrollView style={containerStyle} contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 8 }}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.fromMe ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
        {/* Gallery */}
        <View style={styles.galleryRow}>
          {galleryImages.map((img, idx) => (
            <Image key={idx} source={{ uri: img.uri }} style={styles.galleryImage} />
          ))}
        </View>
      </ScrollView>
      {/* Message Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#aaa"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Feather name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    zIndex: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ddd',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  iconButton: {
    backgroundColor: '#edeaf3',
    borderRadius: 16,
    padding: 8,
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },
  myMessage: {
    backgroundColor: '#7c5dfa',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  theirMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#edeaf3',
  },
  messageText: {
    color: '#222',
    fontSize: 15,
  },
  galleryRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  galleryImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#edeaf3',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 40,
    fontSize: 16,
    color: '#222',
  },
  sendButton: {
    backgroundColor: '#7c5dfa',
    borderRadius: 16,
    padding: 10,
    marginLeft: 8,
  },
}); 