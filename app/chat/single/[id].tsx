import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import SingleChatScreen from '../SingleChatScreen';

export default function SingleChatRoute() {
  const params = useLocalSearchParams();
  // Pass params to SingleChatScreen as props if needed
  return <SingleChatScreen {...params} />;
} 