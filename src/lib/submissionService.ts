import { addTool } from './toolsService';

const KEY = 'toolSubmissions';

export interface Submission {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
  category: string;
  note: string;
  submittedAt: number;
  status: 'pending' | 'approved' | 'rejected';
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function getSubmissions(): Submission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(submissions: Submission[]): void {
  localStorage.setItem(KEY, JSON.stringify(submissions));
}

export function addSubmission(
  data: Omit<Submission, 'id' | 'submittedAt' | 'status'>
): Submission {
  const submission: Submission = {
    ...data,
    id: uid(),
    submittedAt: Date.now(),
    status: 'pending',
  };
  write([...getSubmissions(), submission]);
  return submission;
}

export function approveSubmission(id: string): void {
  const submissions = getSubmissions();
  const sub = submissions.find(s => s.id === id);
  if (!sub) return;

  addTool({
    title: sub.title,
    description: sub.description,
    image: sub.image,
    link: sub.url,
    category: (sub.category as any) || 'Other',
  });

  sub.status = 'approved';
  write(submissions);
}

export function rejectSubmission(id: string): void {
  const submissions = getSubmissions();
  const sub = submissions.find(s => s.id === id);
  if (sub) {
    sub.status = 'rejected';
    write(submissions);
  }
}

export function deleteSubmission(id: string): void {
  write(getSubmissions().filter(s => s.id !== id));
}
