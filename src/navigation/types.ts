export type RootStackParamList = {
  Welcome: undefined;
  Main: { userName?: string };
  ClassDetail: { classId: string };
  ProfileSettings: { initialTab?: 'gym' | 'personal' | 'membership' } | undefined;
};

export type TabParamList = {
  Home: { userName?: string };
  Classes: undefined;
  Door: undefined;
  Timer: undefined;
  Profile: undefined;
};