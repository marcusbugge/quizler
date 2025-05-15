export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          first_name: string | null;
          last_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          user_id: string;
          tittel: string;
          dato: string;
          quiz_type: string;
          sporsmal: Record<string, unknown>[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tittel: string;
          dato: string;
          quiz_type: string;
          sporsmal: Record<string, unknown>[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tittel?: string;
          dato?: string;
          quiz_type?: string;
          sporsmal?: Record<string, unknown>[];
          created_at?: string;
        };
      };
      // Legg til flere tabeller etter behov
    };
    // Legg til views, funksjoner osv. etter behov
  };
};
