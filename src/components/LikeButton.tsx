import {useState} from 'react';
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { addFavoriteToProfile } from "../utils/likeUtils";
import { IconButton } from "@mui/material";

export const LikeButton: React.FC<any> = ({ propertyId, user, favorites, property, style, handleLikeUpdate }) => {
    const [favorite, setFavorite] = useState<boolean>(favorites?.indexOf(property.id) !== -1);

    const handleFavorite = async (evt: any, propertyId: string) => {
        evt.stopPropagation();
        if (await addFavoriteToProfile(propertyId, user, favorites, property, !favorite,)) {
            setFavorite(!favorite);
            handleLikeUpdate(propertyId, !favorite);
        }
    }

    return (
        <IconButton
        onClick={(evt) => { handleFavorite(evt, propertyId) }}
        aria-label="favorite"
        style={style || { 
         top: '0px', right: '10px', color: 'white', cursor: 'pointer',  fontSize: '25px' }}
        sx={{
          '&:hover': {
            backgroundColor: favorite ? 'grey' : 'red', // Change color on hover
          },
          '&': {
            backgroundColor: favorite ? 'red' : 'grey', 
          }
        }}
      >
        {favorite ?
          <Favorite
            style={{ fontSize: '25px' }}
            className="favorite-icon"
          /> :
          <FavoriteBorder
          style={{ fontSize: '25px' }}
            className="favorite-icon"
          />
        }
      </IconButton>
    )
};
