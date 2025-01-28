import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
  } from "react-native-appwrite";
  
  export const appwriteConfig = {
    endpoint:'https://cloud.appwrite.io/v1',
    platform: 'com.ms.aora',
    projectId: '6772ec03002c19f5ca92',
    databaseId: '6773fe95002fd95dd177',
    userCollectionId: '6773fec90035bfd16d84',
    videoCollectionId: '6773ff00003a2d2af094',
    storageId: '677403090024d8d9d2d8'
  }
  
  // Init your React Native SDK
  const client = new Client();
  
  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);
  
  const account = new Account(client);
  const avatars = new Avatars(client);
  const databases = new Databases(client);
  const storage = new Storage(client);
  
  export const createUser = async (email, password, username) => {
    // Register User
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
      if (!newAccount) throw Error;
      const avatarURL = avatars.getInitials(username);
  
      await signIn(email, password);
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        { accountId: newAccount.$id, email, username, avatar: avatarURL }
      );
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const signIn = async (email, password) => {
    try {
      const session = account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  // Get Account
  export async function getAccount() {
    try {
      const currentAccount = await account.get();
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Get Current User
  export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  
  export const logout = async () => {
    try {
      const session = await account.deleteSession("current");
      return session;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const getAllPosts = async () => {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc("$createdAt")]
      );
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const getLatestPosts = async () => {
    try {
      const latestPosts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(3)]
      );
  
      return latestPosts.documents;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const searchPosts = async (query) => {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.search("title", query)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const getUserPosts = async (userId) => {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const getFilePreview = async (fileId, type) => {
    let fileURL;
    try {
      if (type === "video") {
        fileURL = storage.getFileView(appwriteConfig.storageId, fileId);
      } else if (type === "image") {
        fileURL = storage.getFilePreview(
          appwriteConfig.storageId,
          fileId,
          2000,
          2000,
          "top",
          100
        );
      } else {
        throw new Error("Invalid file type");
      }
      if (!fileURL) throw Error;
      return fileURL;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const uploadFile = async (file, fileType) => {
    if (!file) return;
    const { mimeType, ...rest } = file;
    const asset = {
      name: file.fileName,
      type: file.mimeType,
      size: file.fileSize,
      uri: file.uri,
    };
  
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );
  
      const fileURL = await getFilePreview(uploadedFile.$id, fileType);
      return fileURL;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const createPost = async (form) => {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
        }
      );
      return newPost;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const savePost = async (documentId, data) => {
    try {
      const savedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        documentId,
        data
      );
      return savedPost;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const deletePost = async (documentId) => {
    try {
      const deletedPost = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        documentId
      );
      return deletedPost;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  export const getSavedPosts = async (userId) => {
    try {
      const savedPosts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.contains("saved_by", [userId])]
      );
  
      return savedPosts.documents;
    } catch (error) {
      throw new Error(error);
    }
  };
  