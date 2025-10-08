import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Coffee,
  Euro,
  House,
  LucideLampWallDown,
  Search,
  ShoppingBag,
} from "lucide-react-native";

export default function List() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const transactions = useCallback(() => [
    {
      name: "Carrefour Market",
      date: "30 mai",
      debit: true,
      iconColor: "#F97316",
      Icon: ShoppingBag,
      amount: "78,35",
    },
    {
      name: "Loyer Appartement",
      date: "28 mai",
      debit: true,
      iconColor: "purple",
      Icon: House,
      amount: "850,00",
    },
    {
      name: "Starbucks",
      date: "27 mai",
      debit: true,
      iconColor: "orange",
      Icon: Coffee,
      amount: "4,95",
    },
    {
      name: "Salaire",
      date: "25 mai",
      debit: false,
      iconColor: "green",
      Icon: LucideLampWallDown,
      amount: "2 450,00",
    },
  ],[]);

  const filterTransactions = useMemo(() => {
    let filteredResult = [...transactions()];
    if (activeFilter === "all") {
      filteredResult = [...transactions()];
    } else if (activeFilter === "debit") {
      filteredResult = transactions().filter((el) => el.debit === true);
    } else {
      filteredResult = transactions().filter((el) => el.debit === false);
    }

    if (search !== "") {
      filteredResult = filteredResult.filter((el) => el.name.includes(search));
    }

    return filteredResult;
  }, [activeFilter, search, transactions]);

  return (
    
    <View className="bg-white rounded-xl px-4 py-6 mb-[300px]">
      <View className="flex-row justify-between mb-4 items-start">
        <Text className="text-muted-foreground py-2">Transactions Recents</Text>
        <View className="flex-row flex-wrap justify-end flex-1 gap-1">
          <TouchableOpacity className="" onPress={() => setActiveFilter("all")}>
            <Text
              className={` ${activeFilter === "all" && "bg-card text-primary "} px-2 py-2 rounded-md`}
            >
              Toutes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveFilter("debit")}>
            <Text
              className={`${activeFilter === "debit" && "bg-card text-primary "} px-2 py-2 rounded-md`}
            >
              Depenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveFilter("credit")}>
            <Text
              className={`${activeFilter === "credit" && "bg-card text-primary "} px-2 py-2 rounded-md`}
            >
              Revenus
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-2 mb-5 bg-gray-50 flex-row  gap-2 items-center px-2 rounded-xl">
        <Search size={17} color={"gray"} />
        <TextInput
          className="border-none w-full outline-none px-3 py-3"
          placeholder="Rechercher une transaction"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View className="gap-4">
        {filterTransactions.length !== 0 ? (
          filterTransactions.map((el, index) => (
            <View key={index} className="flex-row items-center justify-between">
              <View className="flex-row gap-2 items-center">
                <View className="flex items-center justify-center rounded-full bg-card px-2 py-2">
                  <el.Icon color={el.iconColor} size={20} />
                </View>
                <View>
                  <Text>{el.name}</Text>
                  <Text className="text-xs mt-[2px] text-muted-foreground">
                    {el.date}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-2 items-center">
                <View className="flex-row gap-2 items-center">
                  <Text
                    className={`text-base ${el.debit ? "text-red-500" : "text-green-500"}`}
                  >
                    {el.debit ? "-" : "+"}
                    {el.amount}
                  </Text>
                  <Euro size={16} color={`${el.debit ? "red" : "green"}`} />
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-yellow-50 px-2 py-4 rounded-xl">
            <Text className="text-center text-yellow-500">
              Pas de Transaction trouver
            </Text>
          </View>
        )}
      </View>

      <Text className="text-primary text-center mt-6">
        Voir toutes les transactions
      </Text>
    </View>
  );
}
