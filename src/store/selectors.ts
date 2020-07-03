import { RootState } from "./types";

export const getUsername = (state: RootState) => state.system.userName;

export const isLoggedIn = (state: RootState) => state.system.loggedIn;
