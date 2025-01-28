import React, { useState } from "react";

import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox";

import { useGlobalContext } from "../../context/GlobalProvider";
import { getUserPosts, logout } from "../../lib/appwrite";
import { router } from "expo-router";
import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";

const Profile = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const { data: userPosts, refetch } = useAppwrite(() =>
    getUserPosts(user.$id)
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/signin");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} creator={item.creator} />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="flex w-full items-end mb-10"
              onPress={handleLogout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="h-16 w-16 border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                resizeMode="cover"
                className="w-[90%] h-[90%] rounded-lg"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-white text-lg font-psemibold"
            />
            <View className="mt-5 flex-row">
              <InfoBox
                title={userPosts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-white text-xl font-psemibold"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-white text-xl font-psemibold"
              />
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
