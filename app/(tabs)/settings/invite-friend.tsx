import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Check, Copy, Link } from "lucide-react-native";

export default function InviteFriend() {
  const image = require("@/assets/images/invite.png");
  const [click, setClick] = React.useState<boolean>(false);
  return (
    <View className="flex-1 bg-white items-center justify-center gap-3 px-6">
      <View className="bg-orange-100 p-4 rounded-full">
        <View className="bg-orange-200 p-4 rounded-full">
          <View className="w-16 h-16 items-center justify-center bg-primary rounded-full">
            <Link color={"#fff"} />
          </View>
        </View>
      </View>
      <View className="mt-2 mb-2">
        <Text className="font-extrabold text-4xl text-center">
          Share the link
        </Text>
        <Text className="text-muted-foreground text-center text-xl px-12 mt-2 ">
          Send this link to your friend and get a bonus from each friend
        </Text>
      </View>
      <View className="mt-4 border border-border rounded-lg  w-full items-center justify-center px-4 py-3 flex-row gap-2 mx-4 justify-between">
        <Text className="text-muted-foreground text-xl">
          mybank.com/invite/Ahdy689
        </Text>
        <TouchableOpacity
          onPress={() => {
            setClick(true);

            setTimeout(() => {
              setClick(false);
            }, 2000);
          }}
        >
          {click ? <Check color={"#71deb1"} /> : <Copy />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
