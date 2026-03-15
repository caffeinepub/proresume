import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Education {
    id: bigint;
    gpa: string;
    field: string;
    endDate: string;
    institution: string;
    degree: string;
    startDate: string;
}
export interface Language {
    id: bigint;
    language: string;
    proficiency: string;
}
export interface PersonalInfo {
    linkedin: string;
    name: string;
    email: string;
    website: string;
    jobTitle: string;
    phone: string;
    location: string;
    photoUrl?: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Certification {
    id: bigint;
    url: string;
    date: string;
    name: string;
    issuer: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface WorkExperience {
    id: bigint;
    title: string;
    endDate?: string;
    bullets: Array<string>;
    company: string;
    isCurrent: boolean;
    location: string;
    startDate: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Project {
    id: bigint;
    url: string;
    bullets: Array<string>;
    name: string;
    description: string;
}
export interface SkillCategory {
    id: bigint;
    category: string;
    skills: Array<string>;
}
export interface ResumeData {
    projects: Array<Project>;
    targetJobDescription: string;
    education: Array<Education>;
    workExperience: Array<WorkExperience>;
    languages: Array<Language>;
    summary: string;
    certifications: Array<Certification>;
    personalInfo: PersonalInfo;
    skills: Array<SkillCategory>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteResume(): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getResume(): Promise<ResumeData | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    isCallerAdmin(): Promise<boolean>;
    isPaid(user: Principal): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    recordRazorpayPayment(paymentId: string): Promise<boolean>;
    saveResume(resume: ResumeData): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
