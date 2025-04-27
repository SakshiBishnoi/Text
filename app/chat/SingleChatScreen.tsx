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
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface SingleChatScreenProps {
  id?: string;
  name?: string;
  avatar?: string;
}

const HEADER_HEIGHT = 64;

// --- Haptic Utility Function (Simplified) ---
const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error' = 'light') => {
  try {
    switch (type) {
      case 'light': await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
      case 'medium': await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
      case 'heavy': await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); break;
      case 'selection': await Haptics.selectionAsync(); break;
      case 'success': await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
      case 'warning': await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); break;
      case 'error': await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
    }
  } catch (e) { console.error("Haptic trigger failed", e); }
};
// --- End Haptic Utility ---

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
      // Trigger success haptic
      triggerHaptic('success'); 
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
                onPress={() => { triggerHaptic(); router.back(); }}
              >
                <Ionicons name="chevron-back" size={28} color="#007AFF" />
              </TouchableOpacity>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <Text style={styles.userName}>{user.name}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => {
                  triggerHaptic();
                  // Add video call action here
                }}
              >
                <Ionicons name="videocam" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => {
                  triggerHaptic();
                  // Add audio call action here
                }}
              >
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

          {/* Enhanced Chat Input Interface */}
          <View style={styles.inputArea}>
            {/* Main Input Row */}
            <View style={styles.inputContainer}>
              {/* Text Input */}
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Message..."
                placeholderTextColor="#999"
                value={input}
                onChangeText={setInput}
                multiline
                returnKeyType="default"
                blurOnSubmit={false}
              />
              {/* Send/Audio Wave Button */}
              <TouchableOpacity
                style={styles.sendButton}
                onPress={input.trim() ? sendMessage : () => triggerHaptic('light')}
              >
                {input.trim() ? (
                  <MaterialIcons name="send" size={22} color="#5B9EF8" />
                ) : (
                  <MaterialIcons name="graphic-eq" size={24} color="#5B9EF8" />
                )}
              </TouchableOpacity>
            </View>

            {/* Quick action buttons - Conditional Layout */}
            {isWeb ? (
              // Web Layout: Wrapping View
              <View style={styles.quickActionButtonsWebContainer}>
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionButtonWeb]}
                  onPress={() => { triggerHaptic(); /* Handle Photo action */ }}
                >
                  <MaterialIcons name="image" size={18} color="#555" style={styles.quickActionIcon} />
                  <Text style={styles.quickActionText}>Photo</Text> 
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionButtonWeb]}
                  onPress={() => { triggerHaptic(); /* Handle Document action */ }}
                >
                  <MaterialIcons name="insert-drive-file" size={18} color="#555" style={styles.quickActionIcon} />
                  <Text style={styles.quickActionText}>Document</Text> 
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionButtonWeb]}
                  onPress={() => { triggerHaptic(); /* Handle Camera action */ }}
                >
                  <MaterialIcons name="camera-alt" size={18} color="#555" style={styles.quickActionIcon} />
                  <Text style={styles.quickActionText}>Camera</Text> 
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionButtonWeb]}
                  onPress={() => { triggerHaptic(); /* Handle Location action */ }}
                >
                  <MaterialIcons name="location-on" size={18} color="#555" style={styles.quickActionIcon} />
                  <Text style={styles.quickActionText}>Location</Text> 
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionButtonWeb]}
                  onPress={() => { triggerHaptic(); /* Handle Contacts action */ }}
                >
                  <MaterialIcons name="person" size={18} color="#555" style={styles.quickActionIcon} />
                  <Text style={styles.quickActionText}>Contacts</Text> 
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionButtonWeb]}
                  onPress={() => { triggerHaptic(); /* Handle Poll action */ }}
                >
                  <MaterialIcons name="poll" size={18} color="#555" style={styles.quickActionIcon} />
                  <Text style={styles.quickActionText}>Poll</Text> 
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionButtonWeb]}
                  onPress={() => { triggerHaptic(); /* Handle Events action */ }}
                >
                  <MaterialIcons name="event" size={18} color="#555" style={styles.quickActionIcon} />
                  <Text style={styles.quickActionText}>Events</Text> 
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quickActionButton, styles.quickActionButtonWeb]}
                  onPress={() => { triggerHaptic(); /* Handle Calendar Invite action */ }}
                >
                  <MaterialIcons name="calendar-today" size={18} color="#555" style={styles.quickActionIcon} />
                  <Text style={styles.quickActionText}>Calendar Invite</Text> 
                </TouchableOpacity>
              </View>
            ) : (
              // Native Layout: Horizontal ScrollView
              <View style={styles.quickActionButtons}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionScrollContent}>
                  <TouchableOpacity 
                    style={styles.quickActionButton}
                    onPress={() => { triggerHaptic(); /* Handle Photo action */ }}
                  >
                    <MaterialIcons name="image" size={18} color="#555" style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Photo</Text> 
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickActionButton}
                    onPress={() => { triggerHaptic(); /* Handle Document action */ }}
                  >
                    <MaterialIcons name="insert-drive-file" size={18} color="#555" style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Document</Text> 
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickActionButton}
                    onPress={() => { triggerHaptic(); /* Handle Camera action */ }}
                  >
                    <MaterialIcons name="camera-alt" size={18} color="#555" style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Camera</Text> 
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickActionButton}
                    onPress={() => { triggerHaptic(); /* Handle Location action */ }}
                  >
                    <MaterialIcons name="location-on" size={18} color="#555" style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Location</Text> 
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickActionButton}
                    onPress={() => { triggerHaptic(); /* Handle Contacts action */ }}
                  >
                    <MaterialIcons name="person" size={18} color="#555" style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Contacts</Text> 
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickActionButton}
                    onPress={() => { triggerHaptic(); /* Handle Poll action */ }}
                  >
                    <MaterialIcons name="poll" size={18} color="#555" style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Poll</Text> 
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickActionButton}
                    onPress={() => { triggerHaptic(); /* Handle Events action */ }}
                  >
                    <MaterialIcons name="event" size={18} color="#555" style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Events</Text> 
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickActionButton}
                    onPress={() => { triggerHaptic(); /* Handle Calendar Invite action */ }}
                  >
                    <MaterialIcons name="calendar-today" size={18} color="#555" style={styles.quickActionIcon} />
                    <Text style={styles.quickActionText}>Calendar Invite</Text> 
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
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
    paddingBottom: 16,
    paddingTop: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    paddingVertical: 6,
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
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionButtons: {
    marginTop: 10, 
  },
  quickActionButtonsWebContainer: { // New style for web wrapper
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'flex-start', // Or 'space-between' if preferred
  },
  quickActionButtonWeb: { // Specific adjustments for web buttons if needed
    marginBottom: 8, // Add space below wrapped buttons
  },
  quickActionScrollContent: {
    paddingLeft: 4,
    paddingRight: 12,
    alignItems: 'center', 
  },
  quickActionButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIconButton: {
    paddingHorizontal: 8,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionIcon: {
    marginRight: 6,
  },
  quickActionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
