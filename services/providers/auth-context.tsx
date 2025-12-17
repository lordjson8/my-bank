import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Redirect, Stack } from "expo-router";

type AuthType = {
  username: string;
  isLoggedIn: boolean;
  logout: () => void;
  setIsLoading: (value: boolean) => void;
  setOnboarding: (value: boolean) => void;
  setIsLoging: (value: boolean) => void;
  setUsername: (value: string) => void;
  isLoading: boolean;
  onBoarding: boolean;
};

const initialData: AuthType = {
  username: "",
  isLoading: true,
  logout: () => {},
  setIsLoading: () => {},
  setOnboarding: () => {},
  setIsLoging: () => {},
  setUsername: () => {},
  isLoggedIn: false,
  onBoarding: true,
};

const AuthContext = createContext<AuthType>(initialData);

// SplashScreen.preventAutoHideAsync();

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onBoarding, setOnboarding] = useState(true);
  const [isLoggedIn, setIsLoging] = useState(true);
  const logout = () => {};

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("ll: ", isLoading);
  //     setIsLoading(false);
  //   }, 6000);
  //   console.log(isLoading);
  // }, []);

  // useEffect(() => {
  //   if (!isLoading) {
  //     SplashScreen.hideAsync();
  //     console.log("SplashScreen.hide");
  //   }
  // }, [isLoading]);

  return (
    <AuthContext
      value={{
        isLoading,
        isLoggedIn,
        setIsLoading,
        setIsLoging,
        setOnboarding,
        onBoarding,
        logout,
        username,
        setUsername,
      }}
    >
      {children}
    </AuthContext>
  );
};



export default AuthProvider;
