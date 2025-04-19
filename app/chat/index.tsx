import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

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
        {/* Header with Settings Icon */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={styles.header}>Messages</Text>
          <TouchableOpacity style={{ backgroundColor: '#edeaf3', borderRadius: 16, padding: 8 }}>
            <Feather name="settings" size={22} color="#222" />
          </TouchableOpacity>
        </View>
        {/* Avatars Row */}
        <View style={styles.avatarsRow}>
          {users.map((user, idx) => (
            <View key={user.id} style={{ alignItems: 'center', marginRight: 12 }}>
              <View style={styles.avatarWrapper}>
                {user.avatar && user.name !== '+15' ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }]}> 
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{user.name}</Text>
                  </View>
                )}
                {/* Only show online dot for real users, not '+15' */}
                {user.online && user.avatar && user.name !== '+15' && (
                  <View style={styles.onlineDot} />
                )}
              </View>
              <Text style={{ fontSize: 12, color: '#222', textAlign: 'center', marginTop: 4 }}>{user.name}</Text>
            </View>
          ))}
        </View>
        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#edeaf3', borderRadius: 16, paddingHorizontal: 12 }}>
            <Feather name="search" size={18} color="#aaa" style={{ marginRight: 6 }} />
            <TextInput style={[styles.searchBar, { flex: 1, backgroundColor: 'transparent', paddingHorizontal: 0 }]} placeholder="Search or start of message" placeholderTextColor="#aaa" />
            <Feather name="mic" size={18} color="#aaa" style={{ marginLeft: 6 }} />
          </View>
        </View>
        {/* Pinned Chats Section Title with Pin Icon */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialCommunityIcons name="pin" size={18} color="#7c5dfa" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Pinned Chats</Text>
        </View>
        {/* Pinned Chats (add animation wrapper here) */}
        {/* TODO: Wrap with Animatable.View for fadeIn/slideIn animation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pinnedChatsRow} contentContainerStyle={{ gap: 16 }}>
          {pinnedChats.map((chat, idx) => (
            <TouchableOpacity key={chat.id} style={[styles.pinnedChat, { backgroundColor: chat.bg, width: isWeb ? 320 : 220 }]}> 
              <Image source={{ uri: chat.avatar }} style={styles.pinnedAvatar} />
              <Text style={styles.pinnedName}>{chat.name}</Text>
              <Text style={styles.pinnedMsg} numberOfLines={1}>{chat.lastMessage}</Text>
              {/* Unread badge for the second pinned chat */}
              {idx === 1 && (
                <View style={styles.pinnedBadge}><Text style={styles.pinnedBadgeText}>2</Text></View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* All Chats Section Title with Chat Icon */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialCommunityIcons name="chat" size={18} color="#7c5dfa" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>All Chats</Text>
        </View>
        {/* All Chats (add animation wrapper here) */}
        {/* TODO: Wrap with Animatable.View for fadeIn/slideIn animation */}
        <View>
          {allChats.map((chat, idx) => (
            <TouchableOpacity key={chat.id} style={styles.allChatRow}>
              {chat.avatar ? (
                <Image source={{ uri: chat.avatar }} style={styles.allChatAvatar} />
              ) : (
                <View style={[styles.allChatAvatar, styles.avatarPlaceholder]}><Text style={{ color: '#fff', fontWeight: 'bold' }}>N</Text></View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.allChatName}>{chat.name}</Text>
                <Text style={styles.allChatMsg} numberOfLines={1}>
                  {chat.isVoice ? <Feather name="mic" size={14} color="#7c5dfa" /> : chat.isTyping ? <MaterialCommunityIcons name="pencil" size={14} color="#7c5dfa" /> : null} {chat.lastMessage}
                </Text>
              </View>
              <Text style={styles.allChatTime}>{chat.time}</Text>
              {/* Unread badge for the first chat */}
              {idx === 0 && (
                <View style={{ backgroundColor: '#7c5dfa', borderRadius: 8, minWidth: 16, minHeight: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 4 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>1</Text>
                </View>
              )}
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
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
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
    right: -4,
    bottom: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4cd137',
    borderWidth: 3,
    borderColor: '#fff',
    zIndex: 2,
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