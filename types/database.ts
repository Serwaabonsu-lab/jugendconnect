export type ProfileRole = "organizer" | "member";
export type TaskStatus = "pending" | "accepted" | "declined";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  birth_date: string | null;
  role: ProfileRole;
  created_at: string;
}

export interface EventRow {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  created_by: string | null;
  created_at: string;
}

export interface EventDay {
  id: string;
  event_id: string;
  day_label: string;
  date: string;
  time: string;
  location: string;
  created_at: string;
}

export interface TaskRow {
  id: string;
  event_day_id: string;
  label: string;
  assigned_to: string | null;
  assigned_by: string | null;
  status: TaskStatus;
  decline_reason: string | null;
  response_token: string;
  notified_at: string | null;
  responded_at: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { full_name: string; email: string };
        Update: Partial<Profile>;
      };
      events: {
        Row: EventRow;
        Insert: Partial<EventRow> & {
          title: string;
          start_date: string;
          end_date: string;
        };
        Update: Partial<EventRow>;
      };
      event_days: {
        Row: EventDay;
        Insert: Partial<EventDay> & {
          event_id: string;
          day_label: string;
          date: string;
          time: string;
          location: string;
        };
        Update: Partial<EventDay>;
      };
      tasks: {
        Row: TaskRow;
        Insert: Partial<TaskRow> & {
          event_day_id: string;
          label: string;
        };
        Update: Partial<TaskRow>;
      };
    };
  };
}
