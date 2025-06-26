export interface User {
    name: string;
    email: string;
    role: "manager" | "employee";
    id: number
}
export interface Payload {
    email: string,
    name?: string,
    password: string,
    role?: string,
    team_name?: string
}
export interface FeedbackType {
    id: number;
    sentiment: string;
    strengths: string;
    areas_to_improve: string;
    timestamp: string;
    acknowledged?: boolean;
    employee_id: number
    tags: string[]
};

export interface Request {
    id: number
    employee_id: number
    manager_id: number
    message: string | null | undefined
    status: string
    timestamp: Date
}