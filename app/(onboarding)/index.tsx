import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import Progress from "@/components/auth/progress";
import Message from "@/components/auth/message";
import { Link } from "expo-router";
import { ArrowRight } from "lucide-react-native";

import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as GoogleAuth from 'expo-auth-session/providers/google';
import axios from 'axios'

WebBrowser.maybeCompleteAuthSession();

const androidClientID = '592514759965-62mmuvev6m38vri9gifef85qdiirkhp2.apps.googleusercontent.com'
const web = '592514759965-u8djt882it06mqiiornalvovgskjt49k.apps.googleusercontent.com'
const ios = '592514759965-45f4urfaqpki8qkoug2p10hk6n12ur3g.apps.googleusercontent.com'
const Index = () => {


  axios('http://10.127.98.61:8000/api/library/models/').then(res => console.log(res.data)).catch(err => console.log(err))


    
    const redirectUri = makeRedirectUri({
      // scheme: "bank",
      
      // native: "bank://",
    })
  console.log('redirectUri', redirectUri);

  const [request, response, promptAsync] = GoogleAuth.useAuthRequest(
    {
      androidClientId: androidClientID,
      // iosClientId: ios,
      // webClientId: web,
      // redirectUri,
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
      <ScrollView className="px-4 py-8 " showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={true}>
        {/* <Progress step={1} progress={"20%"} /> */}
        {/* <Button
        disabled={!request}
        title="Login"
        onPress={() =>   promptAsync()}
      /> */}
        <Message />
        <View className="mt-4 mb-4">
          <Link href={"/(onboarding)/auth-options"} asChild>
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
