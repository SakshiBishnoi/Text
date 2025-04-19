import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';

const users = [
  { id: '1', name: 'Daniel', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', online: true },
  { id: '2', name: 'Nixtio', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', online: true },
  { id: '3', name: 'Anna', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', online: true },
  { id: '4', name: 'Nelly', avatar: 'https://randomuser.me/api/portraits/women/45.jpg', online: true },
  { id: '5', name: '+15', avatar: null, online: false },
];

const pinnedChats = [
  {
    id: '1',
    name: 'George Lobko',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    lastMessage: "Thanks for the quick reply!",
    bg: '#E6F7E6',
  },
  {
    id: '2',
    name: 'Amelia Korns',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
    lastMessage: "I'm stuck in 🚗 traffic...",
    bg: '#E6F0F7',
  },
];

const allChats = [
  {
    id: '3',
    name: 'Hasima Medvedova',
    avatar: 'https://randomuser.me/api/portraits/women/48.jpg',
    lastMessage: 'Records a voice message',
    time: '12:23',
    isVoice: true,
  },
  {
    id: '4',
    name: 'Nixtio Team',
    avatar: null,
    lastMessage: 'Daniel is typing ...',
    time: '12:13',
    isTyping: true,
  },
  {
    id: '5',
    name: 'Anatoly Ferusso',
    avatar: 'https://randomuser.me/api/portraits/men/49.jpg',
    lastMessage: 'Sorry for the delay. 😊🙏',
    time: '11:53',
  },
];

export default function ChatListScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const maxContainerWidth = 800;
  const containerStyle = {
    ...styles.container,
    ...(isWeb ? { maxWidth: maxContainerWidth, alignSelf: 'center' as const, width } : { width }),
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f7f6fb' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
      <View style={containerStyle}>
        <Text style={styles.header}>Messages</Text>
        {/* Avatars Row */}
        <View style={styles.avatarsRow}>
          {users.map((user, idx) => (
            <View key={user.id} style={styles.avatarWrapper}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}><Text style={{ color: '#fff', fontWeight: 'bold' }}>{user.name}</Text></View>
              )}
              {user.online && <View style={styles.onlineDot} />}
            </View>
          ))}
        </View>
        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <TextInput style={styles.searchBar} placeholder="Search or start of message" placeholderTextColor="#aaa" />
        </View>
        {/* Pinned Chats */}
        <Text style={styles.sectionTitle}>Pinned Chats</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pinnedChatsRow} contentContainerStyle={{ gap: 16 }}>
          {pinnedChats.map((chat, idx) => (
            <TouchableOpacity key={chat.id} style={[styles.pinnedChat, { backgroundColor: chat.bg, width: isWeb ? 320 : 220 }]}> 
              <Image source={{ uri: chat.avatar }} style={styles.pinnedAvatar} />
              <Text style={styles.pinnedName}>{chat.name}</Text>
              <Text style={styles.pinnedMsg} numberOfLines={1}>{chat.lastMessage}</Text>
              {idx === 1 && (
                <View style={styles.pinnedBadge}><Text style={styles.pinnedBadgeText}>2</Text></View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* All Chats */}
        <Text style={styles.sectionTitle}>All Chats</Text>
        <View>
          {allChats.map((chat) => (
            <TouchableOpacity key={chat.id} style={styles.allChatRow}>
              {chat.avatar ? (
                <Image source={{ uri: chat.avatar }} style={styles.allChatAvatar} />
              ) : (
                <View style={[styles.allChatAvatar, styles.avatarPlaceholder]}><Text style={{ color: '#fff', fontWeight: 'bold' }}>N</Text></View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.allChatName}>{chat.name}</Text>
                <Text style={styles.allChatMsg} numberOfLines={1}>
                  {chat.isVoice ? '🎤 ' : chat.isTyping ? '✍️ ' : ''}{chat.lastMessage}
                </Text>
              </View>
              <Text style={styles.allChatTime}>{chat.time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6fb',
    paddingHorizontal: 16,
    paddingTop: 32,
    width: '100%',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 44,
    aspectRatio: 1,
    borderRadius: 22,
    backgroundColor: '#ddd',
    maxWidth: 44,
    maxHeight: 44,
  },
  avatarPlaceholder: {
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4cd137',
    borderWidth: 2,
    borderColor: '#fff',
  },
  searchBarWrapper: {
    marginBottom: 18,
  },
  searchBar: {
    backgroundColor: '#edeaf3',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 40,
    fontSize: 16,
    color: '#222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  pinnedChatsRow: {
    flexDirection: 'row',
    marginBottom: 18,
    width: '100%',
  },
  pinnedChat: {
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    minWidth: 180,
    maxWidth: 340,
  },
  pinnedAvatar: {
    width: 54,
    aspectRatio: 1,
    borderRadius: 27,
    marginBottom: 8,
    maxWidth: 54,
    maxHeight: 54,
  },
  pinnedName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#222',
  },
  pinnedMsg: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  pinnedBadge: {
    position: 'absolute',
    top: 10,
    right: 18,
    backgroundColor: '#2d8cff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pinnedBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  allChatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    minWidth: 0,
  },
  allChatAvatar: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 40,
    maxHeight: 40,
  },
  allChatName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  allChatMsg: {
    fontSize: 13,
    color: '#555',
  },
  allChatTime: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
}); 