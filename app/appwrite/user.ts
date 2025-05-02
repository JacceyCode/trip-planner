import { getExistingUser } from "./auth";
import { account, appwriteConfig, database } from "./client";

export const updateUserPaidTrips = async (tripId: string) => {
  try {
    // Get userId
    const userId = (await account.get()).$id;

    // Get User
    const user = await getExistingUser(userId);

    // Update Paid Trips Array
    const paidTrips = user?.paidTrips;

    if (!paidTrips.includes(tripId)) {
      paidTrips.push(tripId);
    }

    // Update User's Paid Trip in the Database
    await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user?.$id!,
      {
        paidTrips,
      }
    );
  } catch (error) {
    console.error("Error updating user paid trips: ", error);
  }
};

export const updateUserCreatedTrips = async (
  tripId: string,
  userId: string
) => {
  try {
    // Get User
    const user = await getExistingUser(userId);

    // Update Paid Trips Array
    const createdTrips = user?.createdTrips;

    createdTrips.push(tripId);

    // Update User's Paid Trip in the Database
    await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user?.$id!,
      {
        createdTrips,
      }
    );
  } catch (error) {
    console.error("Error updating user created trips: ", error);
  }
};
