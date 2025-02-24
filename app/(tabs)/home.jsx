import React, { useState } from "react";
import { router } from "expo-router";

import { Text, View, FlatList, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import CustomButton from "../../components/CustomButton";
import VideoCard from "../../components/VideoCard";

import { images } from "../../constants";
import {
  deletePost,
  getAllPosts,
  getLatestPosts,
  savePost,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            creator={item.creator}
            onDeletePost={() => {
              deletePost(item.$id);
              refetch();
            }}
            onSavePost={() => {
              savePost(item.$id, { saved_by: [user.$id] });
            }}
          />
        )}
        ListHeaderComponent={() => (
            <View className="flex my-6 px-4 space-y-6">
              <View className="flex justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    JSMastery
                  </Text>
                </View>
  
                <View className="mt-1.5">
                  <Image
                    source={images.logoSmall}
                    className="w-9 h-10"
                    resizeMode="contain"
                  />
                </View>
              </View>
  
              <SearchInput />
  
              <View className="w-full flex-1 pt-5 pb-8">
                <Text className="text-lg font-pregular text-gray-100 mb-3">
                  Latest Videos
                </Text>
  
                <Trending posts={latestPosts ?? []} />
              </View>
            </View>
          )}
        ListEmptyComponent={() => (
          <>
            <EmptyState
              subtitle="No videos found"
              title="Be the first one to upload a video"
            />
            <CustomButton
              title="Create video"
              containerStyles="w-full my-5"
              handlePress={() => router.push("/create")}
            />
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
