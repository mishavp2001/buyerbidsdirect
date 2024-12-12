import { generateClient } from "aws-amplify/api";
import { updatePropertyLikes, updateUserProfile } from "../ui-components/graphql/mutations";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export async function addFavoriteToProfile(propertyId: string, user:any, favorites: any[], property: any,  favorite: boolean){
    try {
      // IIf its notr favorite now then its changing
      let likes = 0;

      if (favorite) {
        favorites.indexOf(propertyId) === -1 && favorites.push(propertyId);
        likes = property.likes + 1;
      } else {
        favorites = favorites.filter(prop => prop !== propertyId);
        likes = property.likes - 1;
      }
      await client.graphql({
        query: updateUserProfile,
        variables: {
          input: {
            id: user.userId,
            favorites
          },
        },
      });
    await client.graphql({
      query: updatePropertyLikes,
      variables: {
        input: {
          id: propertyId,
          likes: likes
        },
      },
    });
    return true;
  } catch (err) {
    alert(err);
    return false;
  }
  }