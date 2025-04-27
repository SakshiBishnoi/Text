import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Platform, Modal, Alert, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useFonts, Lobster_400Regular } from '@expo-google-fonts/lobster';

const users = [
  { id: '1', name: 'Daniel', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', online: true },
  { id: '2', name: 'Nixtio', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', online: true },
  { id: '3', name: 'Anna', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', online: true },
  { id: '4', name: 'Nelly', avatar: 'https://randomuser.me/api/portraits/women/45.jpg', online: true },
  { id: '5', name: '+15', avatar: null, online: false },
];

// Softer, harmonious pastel palette for light backgrounds
const pastelColors = ['#F6E7FF', '#D0F4DE', '#FFF6D6', '#D6E6FF'];
const pinnedChats = [
  {
    id: '1',
    name: 'George Lobko',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    lastMessage: "Thanks for the quick reply!",
    bg: pastelColors[0],
  },
  {
    id: '2',
    name: 'Emily Carter',
    avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
    lastMessage: "Let's catch up soon!",
    bg: pastelColors[1],
  },
  {
    id: '3',
    name: 'Michael Smith',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    lastMessage: "See you at the meeting!",
    bg: pastelColors[2],
  },
  {
    id: '4',
    name: 'Sophia Lee',
    avatar: 'https://randomuser.me/api/portraits/women/53.jpg',
    lastMessage: "Got your message!",
    bg: pastelColors[3],
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
  const containerDynamicStyle = isWeb ? { maxWidth: maxContainerWidth, alignSelf: 'center' as const, width } : { width }; 
  
  const [modalVisible, setModalVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    Lobster_400Regular,
  });
  if (!fontsLoaded) {
    return null;
  }

  // Logout handler
  const handleLogout = async () => {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    setModalVisible(false);
    router.replace('/auth');
  };

  const cardWidth = isWeb ? 154 : 106;
  const gap = 16;

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f6fb' }}> 
      <View style={[styles.container, containerDynamicStyle]}>
        <View> 
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={styles.lobsterHeader}>Text.</Text>
            <TouchableOpacity style={{ backgroundColor: '#edeaf3', borderRadius: 16, padding: 8 }} onPress={() => setModalVisible(true)}>
              <Feather name="settings" size={22} color="#222" />
            </TouchableOpacity>
          </View>
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
              <View style={styles.modalMenu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setModalVisible(false); router.push('/settings' as any); }}>
                  <Feather name="settings" size={20} color="#7c5dfa" style={{ marginRight: 12 }} />
                  <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setModalVisible(false); router.push('/profile' as any); }}>
                  <MaterialCommunityIcons name="account" size={20} color="#7c5dfa" style={{ marginRight: 12 }} />
                  <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                  <Feather name="log-out" size={20} color="#e74c3c" style={{ marginRight: 12 }} />
                  <Text style={[styles.menuText, { color: '#e74c3c' }]}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16, marginLeft: -1 }}
            contentContainerStyle={{ paddingRight: 1, paddingLeft: 1, alignItems: 'center' }}
          >
            {users.map((user, idx) => (
              <TouchableOpacity
                key={user.id}
                style={styles.avatarButton}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/chat/single/[id]', params: { id: user.id, name: user.name, avatar: user.avatar } })}
              >
                <View style={styles.avatarWrapper}>
                  {user.avatar && user.name !== '+15' ? (
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }]}> 
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{user.name}</Text>
                    </View>
                  )}
                  {user.online && user.avatar && user.name !== '+15' && (
                    <View style={styles.onlineDot} />
                  )}
                </View>
                <Text style={styles.avatarLabel}>{user.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.searchBarWrapper}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#edeaf3', borderRadius: 16, paddingHorizontal: 12 }}>
              <Feather name="search" size={18} color="#aaa" style={{ marginRight: 6 }} />
              <TextInput style={[styles.searchBar, { flex: 1, backgroundColor: 'transparent', paddingHorizontal: 0 }]} placeholder="Search or start of message" placeholderTextColor="#aaa" />
              <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
                <Feather name="mic" size={18} color="#aaa" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView style={{ flex: 1, width: '100%', marginTop: 16 }}> 
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <MaterialCommunityIcons name="pin" size={18} color="#7c5dfa" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Pinned Chats</Text>
          </View>
          <FlatList
            data={pinnedChats}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8, alignItems: 'center', paddingBottom: 8 }}
            ItemSeparatorComponent={() => <View style={{ width: gap }} />}
            renderItem={({ item: chat }) => (
              <Pressable
                style={[
                  styles.pinnedChat,
                  {
                    backgroundColor: chat.bg,
                    width: cardWidth,
                    marginVertical: 8, 
                  },
                ]}
                onPress={() => router.push({ pathname: '/chat/single/[id]', params: { id: chat.id, name: chat.name, avatar: chat.avatar } })}
              >
                <Image source={{ uri: chat.avatar }} style={styles.pinnedAvatar} />
                <Text style={styles.pinnedName}>{chat.name}</Text>
                <Text style={styles.pinnedMsg} numberOfLines={1}>{chat.lastMessage}</Text>
              </Pressable>
            )}
            getItemLayout={(_, index) => ({ length: cardWidth + gap, offset: (cardWidth + gap) * index, index })}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 16 }}>
            <MaterialCommunityIcons name="chat" size={18} color="#7c5dfa" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>All Chats</Text>
          </View>
          {allChats.map((chat, idx) => (
            <TouchableOpacity key={chat.id} style={styles.allChatRow} onPress={() => router.push({ pathname: '/chat/single/[id]', params: { id: chat.id, name: chat.name, avatar: chat.avatar } })}>
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
              {idx === 0 && (
                <View style={{ backgroundColor: '#7c5dfa', borderRadius: 8, minWidth: 16, minHeight: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 4 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>1</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6fb',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 62,
    width: '100%',
    flexDirection: 'column',
  },
  lobsterHeader: {
    fontSize: 33,
    fontFamily: 'Lobster_400Regular',
    color: '#222',
    letterSpacing: -0.5,
  },
  avatarsRow: {
    // removed, replaced by horizontal ScrollView
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
    minWidth: 144,
    maxWidth: 272,
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
  allChatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 44, 84, 0.18)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalMenu: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 40,
    width: 260,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c6c6c8',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f7',
  },
  menuText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  avatarButton: {
    alignItems: 'center',
    marginRight: 4,
    padding: 0,
    borderRadius: 24,
    backgroundColor: 'transparent',
    minWidth: 60,
    minHeight: 70,
    transitionProperty: Platform.OS === 'web' ? 'box-shadow,transform' : undefined,
    transitionDuration: Platform.OS === 'web' ? '0.15s' : undefined,
  },
  avatarLabel: {
    fontSize: 12,
    color: '#222',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
    maxWidth: 60,
  },
}); 