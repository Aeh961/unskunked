import { Href, Link } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { ListItem } from "@/src/components/ListItem";
import { Screen, Stack } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { spacing } from "@/src/theme";

type Row = {
  title: string;
  subtitle: string;
  icon: Parameters<typeof ListItem>[0]["icon"];
  href: Href;
};

const referenceRows: Row[] = [
  { title: "Species Reference", subtitle: "Fish database with bait, rigs, and seasons", icon: "fish", href: "/species" as Href },
  { title: "Rigs & Knots", subtitle: "Build a rig step by step", icon: "git-branch", href: "/rigs" as Href },
  { title: "Learning Center", subtitle: "Beginner lessons and topics", icon: "book", href: "/learn" as Href },
  { title: "Advanced Search", subtitle: "Search everything at once", icon: "search", href: "/search" as Href }
];

const dataRows: Row[] = [
  { title: "Regulations", subtitle: "Season, limits, and legal status", icon: "shield-checkmark", href: "/regulations" as Href },
  { title: "Data Sources", subtitle: "Where each recommendation comes from", icon: "server", href: "/data-sources" as Href },
  { title: "Weather", subtitle: "Conditions and tide windows", icon: "partly-sunny", href: "/weather" as Href }
];

const youRows: Row[] = [
  { title: "Favorites", subtitle: "Saved fish, waters, rigs, and knots", icon: "heart", href: "/favorites" as Href },
  { title: "Fishing Stats", subtitle: "Patterns from your logged trips", icon: "stats-chart", href: "/stats" as Href },
  { title: "Start Here", subtitle: "A simple beginner setup path", icon: "flag", href: "/start" as Href }
];

const appRows: Row[] = [
  { title: "Settings", subtitle: "Region, demo mode, and preferences", icon: "settings-outline", href: "/settings" as Href },
  { title: "Feedback", subtitle: "Report a bug or suggest a change", icon: "chatbox-ellipses", href: "/feedback" as Href },
  { title: "Export Data", subtitle: "Download everything saved on this device", icon: "download", href: "/export" as Href },
  { title: "Offline Mode", subtitle: "Download packs for no-signal trips", icon: "cloud-offline", href: "/offline" as Href },
  { title: "About", subtitle: "Version and disclaimer", icon: "information-circle", href: "/about" as Href }
];

function RowGroup({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <SectionHeader title={title} />
      <Stack>
        {rows.map((row) => (
          <Link key={row.href.toString()} href={row.href} asChild>
            <ListItem title={row.title} subtitle={row.subtitle} icon={row.icon} onPress={() => {}} />
          </Link>
        ))}
      </Stack>
    </View>
  );
}

export default function MoreScreen() {
  return (
    <Screen>
      <AppText variant="display">MORE</AppText>
      <RowGroup title="Reference" rows={referenceRows} />
      <RowGroup title="Regulations & Conditions" rows={dataRows} />
      <RowGroup title="You" rows={youRows} />
      <RowGroup title="App" rows={appRows} />
    </Screen>
  );
}
