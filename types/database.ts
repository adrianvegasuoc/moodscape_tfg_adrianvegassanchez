export type Json =
  | string
  | number
  | boolean
  | null
  | {
      [key: string]: Json | undefined;
    }
  | Json[];

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          user_id: string;
          prompt: string;
          image_url: string | null;
          created_at: string;
          is_public: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt: string;
          image_url?: string | null;
          created_at?: string;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt?: string;
          image_url?: string | null;
          created_at?: string;
          is_public?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
