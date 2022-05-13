import React from "react";

export enum Theme {
  unselected,
  genre,
  member,
}

export type ThemeOption = {
  value: Theme,
  text: string
}

export const themeOptions: ThemeOption[] = [
  {value: Theme.unselected, text:'=分類を選択してください='},
  {value: Theme.genre, text:'ジャンル'},
  {value: Theme.member, text:'発表者'},
];
