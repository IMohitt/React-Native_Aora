import { Text, View, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import useAppwrite from "../../lib/useAppwrite";
import { getSavedPosts } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: savedPosts, refetch } = useAppwrite(() =>
    getSavedPosts(user.$id)
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
            <VideoCard video={item} creator={item.creator} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="items-start flex-row mb-6">
              <View>
                <Text className="text-2xl text-white font-psemibold">
                  Saved Videos
                </Text>
              </View>
            </View>
            <SearchInput placeholder="Search for a video topic" />
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            <EmptyState
              subtitle="No saved videos found"
              title="You have not bookmarked any video so far."
            />
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
