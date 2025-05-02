import { Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";

export const getAllTrips = async (limit: number, offset: number) => {
  const allTrips = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId,
    [Query.limit(limit), Query.offset(offset), Query.orderDesc("createdAt")]
  );

  if (allTrips.total === 0) {
    console.error("No trips found");
    return { allTrips: [], total: 0 };
  }

  return {
    allTrips: allTrips.documents,
    total: allTrips.total,
  };
};

export const getTripById = async (tripId: string) => {
  const trip = await database.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId,
    tripId
  );

  if (!trip.$id) {
    console.log("Trip not found");
    return null;
  }

  return trip;
};

export const updateTripsPaidUsers = async (tripId: string) => {
  try {
    // Get userId
    const userId = (await account.get()).$id;

    // Get Trip
    const trip = await getTripById(tripId);

    // Update Trips Paid Users Array
    const paidUsers = trip?.paidUsers;
    paidUsers.push(userId);

    // Update User's Paid Trip in the Database
    await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripCollectionId,
      tripId,
      {
        paidUsers,
      }
    );
  } catch (error) {
    console.error("Error updating user created trips: ", error);
  }
};

export const getUserPaidTrips = async (limit: number, offset: number) => {
  try {
    // Get userId
    const userId = (await account.get()).$id;

    const allTrips = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tripCollectionId,
      [
        Query.contains("paidUsers", [userId]),
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("createdAt"),
      ]
    );

    if (allTrips.total === 0) {
      return { allTrips: [], total: 0 };
    }

    return {
      allTrips: allTrips.documents,
      total: allTrips.total,
    };
  } catch (error) {
    console.error("Error getting User's paid trips: ", error);
  }
};
