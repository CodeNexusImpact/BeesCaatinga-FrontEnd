import Icon from "@/components/icon";
import Input from "@/components/input";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Input iconName= "user" placeholder="Enter your username" />
      <Input iconName="lock" placeholder="Enter your password" secureTextEntry={true}></Input>
      <Icon name={'home'} />
    </View>
  );
}
