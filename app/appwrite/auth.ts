import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
    );
  } catch (error) {
    console.error("Error logging in with Google:", error);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();

    if (!user) return redirect("/sign-in");

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ]
    );

    if (documents.length === 0) return redirect("/sign-in");

    return documents[0];
  } catch (error) {
    console.error("Error getting user:", error);
  }
};

export const getGooglePicture = async (accessToken: string) => {
  try {
    // Use the token to fetch the user's Google profile picture
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch Google profile picture");

    const { photos } = await response.json();

    return photos?.[0]?.url || null;
  } catch (error) {
    console.error("Error getting user picture:", error);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");

    return true;
  } catch (error) {
    console.error("Error logging out user:", error);
    return false;
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();

    if (!user) throw new Error("User not found");

    const { providerAccessToken } = (await account.getSession("current")) || {};

    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

    // Create a new user document in the database
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: profilePicture,
        joinedAt: new Date().toISOString(),
      }
    );

    if (!newUser.$id) redirect("/sign-in");

    return newUser;
  } catch (error) {
    console.error("Error getting user data:", error);
  }
};

export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", id)]
    );

    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error getting existing user:", error);
  }
};

export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const { documents: users, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.limit(limit), Query.offset(offset)]
    );

    if (total === 0) return { users: [], total };

    return { users, total };
  } catch (error) {
    console.error("Error getting all users:", error);
    return { users: [], total: 0 };
  }
};
