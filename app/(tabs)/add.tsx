import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/dashboard/header";
import { Link } from "expo-router";
import { WarningBanner } from "@/components/warning-barner";
import { Check, CircleCheckBig, Search } from "lucide-react-native";
import { TextInput } from "react-native";

interface ITransaction {
  number: string;
  fees: string;
  type: "debit" | "credit";
  ref: string;
  date: Date;
  method: string;
}
const transactions: ITransaction[] = [
  // Original transaction
  {
    number: "+225 07 12 34 56 78",
    fees: "50",
    type: "debit",
    ref: "TX1002",
    date: new Date("2025-11-09T10:30:00Z"),
    method: "MTN MoMo",
  },
  // Added in previous step
  {
    number: "+225 07 11 22 33 44",
    fees: "0",
    type: "credit",
    ref: "TX1003",
    date: new Date("2025-11-10T12:00:00Z"),
    method: "Orange Money",
  },
  {
    number: "+225 07 99 88 77 66",
    fees: "150",
    type: "debit",
    ref: "TX1004",
    date: new Date("2025-11-10T11:45:00Z"),
    method: "Wave",
  },
  // Ten new transactions
  {
    number: "+225 07 10 20 30 40",
    fees: "20",
    type: "debit",
    ref: "TX1005",
    date: new Date("2025-11-11T08:00:00Z"),
    method: "MTN MoMo",
  },
  {
    number: "+225 07 55 66 77 88",
    fees: "0",
    type: "credit",
    ref: "TX1006",
    date: new Date("2025-11-11T09:15:00Z"),
    method: "Orange Money",
  },
  {
    number: "+225 07 33 44 55 66",
    fees: "100",
    type: "debit",
    ref: "TX1007",
    date: new Date("2025-11-12T14:30:00Z"),
    method: "Wave",
  },
  {
    number: "+225 07 21 09 87 65",
    fees: "0",
    type: "credit",
    ref: "TX1008",
    date: new Date("2025-11-12T16:45:00Z"),
    method: "MTN MoMo",
  },
  {
    number: "+225 07 43 21 09 87",
    fees: "75",
    type: "debit",
    ref: "TX1009",
    date: new Date("2025-11-13T10:00:00Z"),
    method: "Orange Money",
  },
  {
    number: "+225 07 87 65 43 21",
    fees: "0",
    type: "credit",
    ref: "TX1010",
    date: new Date("2025-11-13T11:10:00Z"),
    method: "Wave",
  },
  {
    number: "+225 07 13 57 92 46",
    fees: "50",
    type: "debit",
    ref: "TX1011",
    date: new Date("2025-11-14T15:20:00Z"),
    method: "MTN MoMo",
  },
  {
    number: "+225 07 98 76 54 32",
    fees: "0",
    type: "credit",
    ref: "TX1012",
    date: new Date("2025-11-14T17:55:00Z"),
    method: "Orange Money",
  },
  {
    number: "+225 07 54 32 10 98",
    fees: "120",
    type: "debit",
    ref: "TX1013",
    date: new Date("2025-11-15T09:30:00Z"),
    method: "Wave",
  },
  {
    number: "+225 07 65 43 21 01",
    fees: "0",
    type: "credit",
    ref: "TX1014",
    date: new Date("2025-11-15T10:40:00Z"),
    method: "MTN MoMo",
  },
].sort((a, b) => {
  if (a.date < b.date) {
    return -1;
  } else if (a.date > b.date) {
    return 1;
  } else {
    return 0;
  }
});

export default function Transactions() {
  const image = require("@/assets/images/Container.png");

  const [filtered_transactions, setTransactions] = useState(transactions);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="fixed left-0 top-0 mx-4 mt-4">
        <Text className="font-bold text-2xl">Historique</Text>
        <View className="mt-2 mb-5 bg-gray-100 flex-row  gap-2 items-center px-2 rounded-xl">
          <Search size={17} color={"gray"} />
          <TextInput
            onChangeText={(e) => {
              const copy = [...filtered_transactions];
              if (e != "") {
                // const filtered;
                console.log(e)
                setTransactions(copy.filter((el) => el.method.toLowerCase().includes(e.toLowerCase())));
              } else {
                setTransactions(transactions);
              }

              console.log("change");
            }}
            className="border-none w-full outline-none px-4 py-4 text-black"
            placeholder="Rechercher une transaction"
            // value={search}
            placeholderTextColor={"gray"}
            // onChangeText={setSearch}
          />
        </View>
      </View>
      <ScrollView className="">
        {/* <Header /> */}

        <View className="px-4 flex-1 mb-2">
          {filtered_transactions.length > 0 ? (
            <View className="gap-2 flex-1">
              {filtered_transactions.map((transaction) => (
                <Transaction key={transaction.ref} transaction={transaction} />
              ))}
            </View>
          ) : (
            <View className="items-center justify-center mt-12">
              <Image source={image} />

              <Text className="font-bold text-2xl">Aucun résultat trouvé</Text>

              <Text className="text-gray-500  text-center mt-4 px-12 text-base">
                Désolé, il n&apos;y a aucun résultat pour cette recherche,
                veuillez essayer une autre chose.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const Transaction = ({ transaction }: { transaction: ITransaction }) => {
  return (
    <View className="bg-white px-4 py-2 gap-2 rounded-lg flex-1">
      <View className="gap-2 flex-row items-center">
        <View className="w-12 rounded-full items-center justify-center h-12 bg-orange-100 p-4">
          <CircleCheckBig size={30} color={"#F97316"} />
        </View>
        <View className="flex-1 relative">
          <View className=" py-1 flex-row items-center justify-between">
            <Text className="font-bold text-xl ">{transaction.number}</Text>
            <Text className="font-bold text-xl ">
              {" "}
              {transaction.type === "credit" ? "+" : "-"} 5,000 XOF
            </Text>
          </View>
          <View className="py-1 flex-row items-center justify-between">
            <Text className="text-muted-foreground ">{transaction.method}</Text>
            <Text className="text-muted-foreground ">
              {transaction.date.toUTCString()}
            </Text>
          </View>
        </View>
      </View>
      <View className="border-t border-border py-2 flex-row items-center justify-between">
        <Text className="text-muted-foreground ">
          Frais: {transaction.fees} XOF
        </Text>
        <Text className="text-muted-foreground ">Réf: TX{transaction.ref}</Text>
      </View>
    </View>
  );
};
