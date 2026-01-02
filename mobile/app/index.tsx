import Button from "@/components/button";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Title</Text>

      <Button>
        <Text style={{ fontFamily: "DMSansL" }}>ExtraLight</Text>
      </Button>
      <Button>
        <Text style={{ fontFamily: "DMSansR" }}>Regular</Text>
      </Button>
      <Button>
        <Text style={{ fontFamily: "DMSansM" }}>Medium</Text>
      </Button>
      <Button>
        <Text style={{ fontFamily: "DMSansSB" }}>SemiBold</Text>
      </Button>
      <Button>
        <Text style={{ fontFamily: "DMSansB" }}>Bold</Text>
      </Button>
    </View>
  );
}
