import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  import React, { useState } from "react";
  import * as ImagePicker from "expo-image-picker";
  
  import FormField from "../../components/FormField";
  import CustomButton from "../../components/CustomButton";
//   import { ResizeMode, Video } from "expo-av";
  import { icons } from "../../constants";
  import { router } from "expo-router";
  import { createPost } from "../../lib/appwrite";
  import { useGlobalContext } from "../../context/GlobalProvider";
import VideoScreen from "../../components/VideoScreen";
  
  const Create = () => {
    const { user } = useGlobalContext();
    const [form, setForm] = useState({
      title: "",
      video: null,
      thumbnail: null,
      prompt: "",
    });
  
    const [uploading, setUploading] = useState(false);
  
    const openPicker = async (selectedType) => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          selectedType === "image"
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        if (selectedType === "image") {
          setForm({ ...form, thumbnail: result.assets[0] });
        }
        if (selectedType === "video") {
          setForm({ ...form, video: result.assets[0] });
        }
      }
    };
  
    const submit = async () => {
      if (!form.prompt || !form.thumbnail || !form.thumbnail || !form.video) {
        Alert.alert("Please fill in all fields");
      } else {
        setUploading(true);
        try {
          await createPost({ ...form, userId: user.$id });
          Alert.alert("Success", "Post uploaded");
          router.push("/home");
        } catch (error) {
          Alert.alert("Error", error.message);
        } finally {
          setForm({
            title: "",
            video: null,
            thumbnail: null,
            prompt: "",
          });
          setUploading(false);
        }
      }
    };
  
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="w-full min-h-[85vh] px-4 my-6">
            <Text className="text-white text-2xl font-psemibold">
              Upload video
            </Text>
            <FormField
              title="Video Title"
              value={form.title}
              placeholder="Give your video a catchy title"
              handleChangeText={(e) => setForm({ ...form, title: e })}
              otherStyles="mt-10"
            />
            <View className="mt-7 space-y-2">
              <Text className="text-gray-100 text-base font-pmedium">
                Upload video
              </Text>
              <TouchableOpacity onPress={() => openPicker("video")}>
                {form.video ? (
                  <VideoScreen videoSource={video} style={{
                    width: 208,
                    height: 288,
                    borderRadius: 33,
                    marginTop: 12,
                    }}/>
                ) : (
                  <View className="w-full h-40 px-4 bg-black-100 rounded-xl justify-center items-center">
                    <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                      <Image
                        source={icons.upload}
                        resizeMode="contain"
                        className="w-1/2 h-1/2"
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View className="mt-7 space-y-2">
              <Text className="text-gray-100 text-base font-pmedium">
                Upload thumbnail
              </Text>
              <TouchableOpacity onPress={() => openPicker("image")}>
                {form.thumbnail ? (
                  <Image
                    source={{ uri: form.thumbnail.uri }}
                    className="w-full h-64 rounded-2xl"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-16 px-4 bg-black-100 rounded-xl justify-center items-center border border-black-200 flex-row space-y-2">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-5 h-5 mr-2"
                    />
                    <Text className="text-gray-100 text-sm font-pmedium">
                      Choose a file
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <FormField
              title="Prompt"
              value={form.prompt}
              placeholder="Give your video a catchy prompt"
              handleChangeText={(e) => setForm({ ...form, prompt: e })}
              otherStyles="mt-7"
            />
            <CustomButton
              containerStyles="mt-7"
              title="Submit & Publish"
              handlePress={submit}
              isLoading={uploading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default Create;
  