// import {
//   View,
//   Text,
//   ScrollView,
//   KeyboardAvoidingView,
//   TouchableOpacity,
// } from "react-native";
// import React, { useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Progress from "@/components/auth/progress";
// import Input from "@/components/auth/input";
// import SignupButtons from "@/components/auth/signup-buttons";
// import FileInput from "@/components/auth/file-input";
// import { Camera, Upload } from "lucide-react-native";
// import DateInput from "@/components/auth/date-picker";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { InfoFormSchema, InfoFormType } from "@/utils/zod-schemas";
// import RegisteredInput from "@/components/auth/register-input";
// import SubmitButtons from "@/components/auth/submit-buttons";

// export default function Info() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<InfoFormType>({
//     resolver: zodResolver(InfoFormSchema),
//   });

//   const onSubmit = (data: InfoFormType) => {
//     console.log(data);
//   };


//   const [id, setId] = useState<string>("");
//   const [selfie, setSelfie] = useState<string>("");
//   const [date, setDate] = useState<Date | undefined>(undefined);
  
//   return (
//     <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
//       <SafeAreaView className="flex-1 p-4 bg-white">
//         <ScrollView className="px-4 py-8">
//           <Progress step={4} progress="80%" />
//           <View className="mt-6 mb-4">
//             <Text className="text-center font-bold text-2xl">
//               Vérification d&apos;identité
//             </Text>
//             <Text className="text-center text-base font-[400] text-muted-foreground mt-4 leading-6">
//               Ces informations sont nécessaires pour sécuriser votre compte
//             </Text>
//           </View>
//           <RegisteredInput
//             error={errors.surname}
//             register={register}
//             name="surname"
//             secure={false}
//             keyboardType="default"
//             label="Prénom"
//             placeholder="Votre prénom"
//           />

//           <RegisteredInput
//             error={errors.name}
//             secure={false}
//             keyboardType="default"
//             register={register}
//             name="name"
//             label="Nom"
//             placeholder="Votre nom"
//           />
//           <DateInput
//           error={errors.dateOfBirth}
//           // register={register}
//           // name='dateOfBirth'
//             secure={false}
//             date={date}
//             keyboardType="default"
//             setDate={setDate}
//             label="Date de naissance"
//             placeholder="mm/dd/yyyy"
//           />

//           <RegisteredInput
//             error={errors.dateOfBirth}
//             secure={false}
//             register={register}
//             name="address"
//             keyboardType="default"
//             label="Adresse"
//             placeholder="Votre adresse complète"
//           />

//           <FileInput
//             image={id}
//             setImage={setId}
//             label="Pièce d'identité "
//             Icon={Upload}
//             inputLabel="Carte d'identité ou passeport"
//             description="Cliquez pour téléverser"
//           />
//           <FileInput
//             image={selfie}
//             setImage={setSelfie}
//             label="Selfie"
//             Icon={Camera}
//             inputLabel="Photo de vous-même"
//             description="Cliquez pour téléverser"
//           />

//           <SubmitButtons
//             onPressFN={handleSubmit(onSubmit)}
//             href="/(auth)/security"
//             label="Continuer"
//           />

//           <View className="mb-12 mt-3 bg-[#FEFCE8] px-3 py-4 rounded-xl ">
//             <Text className="text-[#854D0E] text-center leading-6">
//               Vos données sont traitées de manière sécurisée et conformément à
//               notre politique de confidentialité.
//             </Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// }
