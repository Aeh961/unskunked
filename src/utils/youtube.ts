import * as Linking from "expo-linking";

export function youtubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function openYoutubeSearch(query: string) {
  return Linking.openURL(youtubeSearchUrl(query));
}
