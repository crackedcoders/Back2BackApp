export type RootStackParamList = {
  Welcome: undefined;
  Main: { userName?: string };
  ClassDetail: { classId: string };
  ProfileSettings: { initialTab?: 'gym' | 'personal' | 'membership' } | undefined;
  CheckInHistory: undefined;
  ClassAttendanceHistory: undefined;
};

export type TabParamList = {
  Home: { userName?: string };
  Classes: undefined;
  Door: undefined;
  Timer: undefined;
  Profile: undefined;
};