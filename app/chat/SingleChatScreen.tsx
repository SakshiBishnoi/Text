import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, ScrollView, Platform, useWindowDimensions, ActivityIndicator, Keyboard } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

interface SingleChatScreenProps {
  id?: string;
  name?: string;
  avatar?: string;
}

// Accept props for id, name, avatar
export default function SingleChatScreen({ id, name, avatar }: SingleChatScreenProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const maxContainerWidth = 600;
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Preload icon fonts
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...Feather.font,
  });

  // Function to scroll to bottom of chat
  const scrollToBottom = (animated = true) => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated });
      }
    }, 100);
  };

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

  // Container style to center content on web
  const containerStyle = {
    flex: 1,
    width: isWeb ? (width > maxContainerWidth ? maxContainerWidth : width) : '100%',
    alignSelf: isWeb ? 'center' as const : undefined,
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#f7f6fb' }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
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
        
        {/* Main content area */}
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingVertical: 16, 
            paddingHorizontal: 8,
            paddingBottom: 16
          }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollToBottom(false)}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.fromMe ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text style={[
                styles.messageText, 
                msg.fromMe ? styles.myMessageText : {}
              ]}>
                {msg.text}
              </Text>
            </View>
          ))}
          
          {/* Gallery */}
          <View style={styles.galleryRow}>
            {galleryImages.map((img, idx) => (
              <Image key={idx} source={{ uri: img.uri }} style={styles.galleryImage} />
            ))}
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 12,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    zIndex: 2,
  },
  backButton: {
    marginRight: 8,
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
    fontSize: 15,
    color: '#222',
  },
  myMessageText: {
    color: '#fff',
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
  }
}); 