import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import { Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";

export default function AccessCode() {
  const [code, setCode] = useState<string>("");

  const handleDeleteCode = () => {
    setCode((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    console.log(code.length);
  }, [code]);

  const handleAddCode = (number: number) => {
    if (code.length < 4) {
      console.log("code", code.length, "number", number);
      setCode((prev) => prev + number);
    }
  };

  return (
    <SafeAreaView className="flex-1 px-4  bg-white">
      <ScrollView
        contentContainerStyle={{
          justifyContent: "space-between",
          flex: 1
        }}
        className="px-4 py-8"
      >
        <View className="flex-1">
          <SignupHeader
            label="Créez votre code d'accès."
            step={3}
            progress="60%"
          />

          <Text className="text-xl text-muted-foreground mb-3">
            Ceci sera utilisé pour vous connecter.
          </Text>
          <View className="flex-row justify-center gap-3 mt-10">
            {[0, 1, 2, 3].map((index) => {
              return (
                <View
                  key={index}
                  className={` rounded-full w-5 h-5 border-2 ${
                    index < code.length && "bg-primary border border-primary"
                  }`}
                />
              );
            })}
          </View>

          <View className="flex-1 items-center mt-10">
            <View className="flex-row gap-10 flex-1 mb-8">
              {[1, 2, 3].map((number) => {
                return (
                  <TouchableOpacity
                    key={number}
                    onPress={() => handleAddCode(number)}
                    className={`h-20 w-20 bg-muted rounded-full items-center justify-center shadow-lg shadow-gray-800 `}
                  >
                    <Text className="text-2xl font-bold">{number}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View className="flex-row gap-10 flex-1 mb-8">
              {[4, 5, 6].map((number) => {
                return (
                  <TouchableOpacity
                    key={number}
                    onPress={() => handleAddCode(number)}
                    className="h-20 w-20 bg-muted rounded-full items-center justify-center shadow-lg shadow-gray-800"
                  >
                    <Text className="text-2xl font-bold">{number}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View className="flex-row gap-10 flex-1 mb-10">
              {[7, 8, 9].map((number) => {
                return (
                  <TouchableOpacity
                    key={number}
                    onPress={() => handleAddCode(number)}
                    className="h-20 w-20 bg-muted rounded-full items-center justify-center shadow-lg shadow-gray-800"
                  >
                    <Text className="text-2xl font-bold">{number}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="flex-row flex-1 gap-10  mb-10 justify-end">
              <TouchableOpacity
                onPress={() => handleAddCode(0)}
                className="h-20 w-20 bg-muted rounded-full items-center justify-center shadow-lg shadow-gray-800"
              >
                <Text className="text-2xl font-bold">0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteCode}
                className="h-20 w-20 bg-muted rounded-full items-center justify-center shadow-lg shadow-gray-800"
              >
                <ChevronLeft size={30} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="">
          <View className="flex-row items-center gap-3"></View>
          <View className="mt-4 mb-12">
            <Link disabled={code.length < 4} href={"/(auth)/info"} asChild>
              <TouchableOpacity
                className={`rounded-xl  flex flex-row items-center py-4 justify-center gap-2 ${code.length < 4 ? "bg-orange-200" : "bg-primary"}`}
              >
                <Text className="text-white text-xl">Continue</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
