export interface User {
    name: string;
    email: string;
    role: string;
    id:  number
}
export interface Payload {
    email: string,
    name?: string,
    password: string,
    role?: string,
    team_name?: string
  }
export interface FeedbackType  {
    id: number;
    sentiment: string;
    strengths: string;
    areas_to_improve: string;
    timestamp: string;
    is_acknowledged?: boolean;
    employee_id: number
    tags: string[]
};