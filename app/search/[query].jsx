import React, { useEffect } from "react";

import { Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams } from "expo-router";
import useAppwrite from "../../lib/useAppwrite";
import { searchPosts } from "../../lib/appwrite";

import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} creator={item.creator} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="text-sm font-pmedium text-gray-100">
              {" "}
              Search results
            </Text>
            <Text className="text-2xl text-white font-psemibold">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput
                placeholder="Search for a video topic"
                initialQuery={query}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            subtitle="No videos found"
            title="No videos found for this search"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
