import { ActionType, ProfileContextType, UserProfile } from "../commmon/types";

export default function profilesReducer(state: ProfileContextType, action: ActionType) {
  const {type, payload} = action;
  switch (type) {
    case "add": { //in case of add
      const newProfile: UserProfile = { //create newProfile
        id: crypto.randomUUID(), 
        name: payload.name as string,
        imageUrl: payload.imageUrl as string,
      }
      const updatedProfiles = [...(state?.profiles??[]), newProfile]; //create updatedProfile - add newprofile to existing profiles
      const updatedState:ProfileContextType = {profiles: updatedProfiles, //update the state
      selectedProfileId:state?.selectedProfileId} 
      return updatedState;
    }
    case "edit": { //in case of edit
      const index = state.profiles.findIndex(profile => profile.id === payload.id)??-1; //find the index of profile being edited
      if(index>-1 && state) { 
        const updatedState = {...state}; //create updated state with existing state
        updatedState.profiles?.splice(index, 1, { //edit the state with splice 
          ...updatedState.profiles[index],
          name: payload.name as string
        })
        return updatedState;
      }
    }
    case "delete": { //in case of delete
      if(state) {
        let updatedState = {...state}; //create updated state with existing state
        updatedState.profiles = updatedState.profiles.filter(profile => profile.id !== payload.id); //filter out the profile being deleted

        return updatedState;
      }
    }
    case "current": { //in case of current
      if(state) {
        let updatedState:ProfileContextType = {...state, selectedProfileId: payload.id as string} //set selectedProfileId to payload.id
        return updatedState;
      }
    }
    case "load": {
      return payload;
    }
  }
  return state;
}
