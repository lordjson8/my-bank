import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import Progress from "@/components/auth/progress";
import Message from "@/components/auth/message";
import { Link } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useAuth } from "@/services/providers/auth-context";

import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as GoogleAuth from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const androidClientID = '592514759965-pjfovq7hqti9kekbs8lvd1hhmv875592.apps.googleusercontent.com'
const web = '592514759965-u8djt882it06mqiiornalvovgskjt49k.apps.googleusercontent.com'
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

const Index = () => {
  const p = useAuth()
  console.log(p)


      const redirectUri = makeRedirectUri({


        scheme: 'bank',


      });

  console.log('redirectUri', redirectUri);

  const [request, response, promptAsync] = GoogleAuth.useAuthRequest(
    {
      clientId: androidClientID,
      scopes: ['openid', 'profile','email'],
      redirectUri,
    },
    // discovery
  );

  useEffect(() => {
    console.log('response', response)
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('code', code)
    }
  }, [response]);

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView className="px-4 py-8 ">
        {/* <Progress step={1} progress={"20%"} /> */}
         <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
        // console.log('pressed')
      }}
    />
        <Message />
        <View className="mt-4 mb-4">
          <Link href={"/(auth)/auth-options"} asChild>
            <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2 mb-12">
              <ArrowRight color={"#fff"} size={24} />
              <Text className="text-white text-xl font-bold">Commencer</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
