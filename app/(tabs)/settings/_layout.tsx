import {
  ExternalPathString,
  Href,
  Link,
  RelativePathString,
  Stack,
} from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

const StackHeader = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const NavLinks: {
    title: string;
    route: Href;
  }[] = [
    {
      title: "Général",
      route: "/settings",
    },
    {
      title: "Numéros",
      route: "/settings/numbers",
    },
    {
      title: "Cartes",
      route: "/settings/cards",
    },
    {
      title: "Plafonds",
      route: "/settings/roof",
    },
    {
      title: "Profil",
      route: "/settings/profile",
    },
  ];

  return (
    <View className="bg-white">
      <View className="flex-row justify-evenly relative">
        {NavLinks.map((link) => {
          const href = link.route;
          const isActive =
            route.name === link.route.toString().replace("/settings/", "") ||
            (route.name === "index" && link.route === "/settings");
          console.log(
            "route.name",
            route.name,
            "link.route",
            link.route,
            isActive
          );

          return (
            <View key={link.title} className="flex-1 relative items-center">
              <Link replace href={href} asChild>
                <TouchableOpacity
                  className={`${isActive && "bg-orange-50"} rounded-lg px-2 py-6 w-full`}
                >
                  <Text
                    className={`${isActive && "text-primary"}  font-bold text-center `}
                  >
                    {link.title}
                  </Text>
                </TouchableOpacity>
              </Link>

              <View
                className={` h-1  w-full absolute bottom-0 ${isActive ? "bg-primary" : "bg-gray-100"}`}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        // headerShown: false,
        animation: "fade",
        header: StackHeader,
      }}
    />
  );
}
