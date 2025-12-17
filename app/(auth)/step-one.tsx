import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { emailSchema, emailType } from "@/utils/zod-schemas";
import BottomBorderedInput from "@/components/auth/bottom-bordered-input";
import PasswordInput from "@/components/auth/password-input";
import { Checkbox } from "expo-checkbox";
import { Link } from "expo-router";
import TextBold from "@/components/auth/text-bold";
import { useEffect, useState } from "react";
import PhoneModal from "@/components/auth/phone-modal";
import { countries } from "@/constants";
import { TextInput } from "react-native-gesture-handler";
import Input from "@/components/auth/input";

export default function EmailSignup() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name,setName] = useState('')

  // useEffect(() => {
  //   p.setOnboarding(false)
  //   console.log('p: ', p.onBoarding)
  // },[])
  return (
    <SafeAreaView className="flex-1 p-4  bg-white">
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
        }}
        className="px-4 py-8"
      >
        <PhoneModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setSelectedCountry={setSelectedCountry}
        />
        <View className="">
          <SignupHeader
            label="Get started with your account!"
            step={1}
            progress="20%"
          />
          <Input keyboardType='email-address' value={name} setValue={setName} placeholder="jane@doe.com" label="Enter Your Email" secure={false} required={true}/>
          {/* <View>
            <View className="flex-row gap-4 mt-4 items-center">
              <View className="border-b border-border  w-20 ">
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text className="text-center text-lg py-4 px-0 font-bold">
                    {selectedCountry.flag} {selectedCountry.code}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1  border-b border-border ">
                <TextInput
                  placeholder={"Numéro de téléphone"}
                  keyboardType="phone-pad"
                  placeholderTextColor={"gray"}
                  className={` w-full text-black px-0 text-lg py-4 border-border `}
                />
              </View>
            </View>
          </View> */}

          <PasswordInput placeholder="Password" />
        </View>
        <View>
          <View className="flex-row items-center gap-3 mb-4">
            <Checkbox
              color={"#F97316"}
              //   onValueChange={() => setBiometric(!biometric)}
              //   value={biometric}
            />
            <View className="flex-1">
              <Text className="flex-1 text-muted-foreground text-pretty text-base">
                J&apos;ai lu et compris les{" "}
                <TextBold label="conditions générales" />
                et la <TextBold label="politique" /> de
                <TextBold label="confidentialité" /> de Quick Finance.
              </Text>
            </View>
          </View>
          <View className="mt-4">
            <Link href={"/(auth)/step-two"} asChild>
              <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2">
                <Text className="text-white text-xl">Commencer</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
