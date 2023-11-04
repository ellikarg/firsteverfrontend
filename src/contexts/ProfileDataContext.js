import React, { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "./CurrentUserContext";

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({children}) => {

        const [profileData, setProfileData] = useState({
          pageProfile: { results: [] },
        });
        const currentUser = useCurrentUser();
      
        useEffect(() => {
          const handleMount = async () => {
            try {
              setProfileData((prevState) => ({
                ...prevState,
              }));
            } catch (err) {
              console.log(err);
            }
          };
      
          handleMount();
        }, [currentUser]);
    return(
        <ProfileDataContext.Provider value={profileData}>
            <SetProfileDataContext.Provider value={setProfileData}>
                {children}
            </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
    )
};