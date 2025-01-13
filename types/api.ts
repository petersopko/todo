export type Todo = {
  id: string;
  todo: string;
  is_completed: boolean;
  date_created: string;
  date_updated: string | null;
  user_created: User;
  user_updated: User | null;
  category: Category;
};

export type User = {
  first_name: string;
  last_name: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  todos: string[];
};

export enum TodoListType {
  UNCOMPLETED = "uncompleted",
  COMPLETED = "completed",
  RECENT_COMPLETED = "recent_completed",
}

export enum NavigationSection {
  DASHBOARD = "dashboard",
  CATEGORY = "category",
  FINISHED = "finished",
  UI_KIT = "ui-kit",
}
