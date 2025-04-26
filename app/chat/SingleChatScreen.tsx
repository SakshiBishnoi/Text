import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  TextInput,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

interface SingleChatScreenProps {
  id?: string;
  name?: string;
  avatar?: string;
}

const HEADER_HEIGHT = 64;

export default function SingleChatScreen({ id, name, avatar }: SingleChatScreenProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const maxContainerWidth = 600;
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey! How are you?', fromMe: false },
    { id: 2, text: "I'm good, thanks! How about you?", fromMe: true },
    { id: 3, text: 'Doing great! Want to grab some donuts?', fromMe: false },
    { id: 4, text: 'Absolutely! 🍩', fromMe: true },
    { id: 5, text: 'What kind?', fromMe: false },
    { id: 6, text: 'Glazed or chocolate?', fromMe: true },
    { id: 7, text: 'Both! 😋', fromMe: false },
  ]);

  // Preload icon fonts
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  // Scroll to bottom helper
  const scrollToBottom = (animated = true) => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated });
      }
    }, 100);
  };

  // Scroll to bottom when a new message is sent
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#7c5dfa" />
      </View>
    );
  }

  // Use props or fallback to default user
  const user = {
    name: name || 'Hasima Medvedova',
    avatar: avatar || 'https://randomuser.me/api/portraits/women/32.jpg',
  };

  // Send message handler
  const sendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: input, fromMe: true },
      ]);
      setInput('');
    }
  };

  // Top padding for Android status bar
  const androidTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

  // Container style to center content on web
  let containerWidth: number = width;
  if (isWeb) {
    containerWidth = Math.min(width, maxContainerWidth);
  }
  const containerStyle = {
    flex: 1,
    width: containerWidth,
    alignSelf: isWeb ? 'center' as const : undefined,
    backgroundColor: '#fff',
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#fff', paddingTop: androidTop }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? HEADER_HEIGHT : 0}
      >
        <View style={[containerStyle, { flex: 1 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={28} color="#007AFF" />
              </TouchableOpacity>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <Text style={styles.userName}>{user.name}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="videocam" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="call" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Main content area */}
          <View style={styles.contentArea}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    msg.fromMe ? styles.myMessage : styles.theirMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.fromMe ? styles.myMessageText : {},
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Input area - fixed at bottom, no extra bottom padding */}
          <View style={styles.inputArea}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Type your message..."
                placeholderTextColor="#999"
                value={input}
                onChangeText={setInput}
                multiline={false}
                returnKeyType="send"
                blurOnSubmit={false}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={!input.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: HEADER_HEIGHT,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingTop: 0,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 4,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: '#7671ff',
    alignSelf: 'flex-end',
    marginLeft: 40,
  },
  theirMessage: {
    backgroundColor: '#e9e9eb',
    alignSelf: 'flex-start',
    marginRight: 40,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  myMessageText: {
    color: '#fff',
  },
  inputArea: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    // No extra bottom padding here
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
    paddingHorizontal: 6,
    maxHeight: 100,
    backgroundColor: 'transparent',
  },
  sendButton: {
    backgroundColor: '#7671ff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
