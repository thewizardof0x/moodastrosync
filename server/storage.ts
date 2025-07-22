import { submissions, type Submission, type InsertSubmission } from "@shared/schema";

export interface IStorage {
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmission(id: number): Promise<Submission | undefined>;
}

export class MemStorage implements IStorage {
  private submissions: Map<number, Submission>;
  private currentId: number;

  constructor() {
    this.submissions = new Map();
    this.currentId = 1;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentId++;
    const submission: Submission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }
}

export const storage = new MemStorage();
