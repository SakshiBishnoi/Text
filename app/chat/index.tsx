import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function ChatListScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Chat List</Text>
      {/* TODO: Render list of conversations */}
      <Button title="Go to Chat Detail" onPress={() => router.push('/chat/detail')} />
    </View>
  );
} 