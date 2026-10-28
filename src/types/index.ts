// =============================================================================
// GDG on Campus — Taif University (Web Track Platform 2026)
// Model & Types Definitions — Phase 1 & Foundation
// =============================================================================

export type UserRole = 'track_leader' | 'supervisor' | 'member';

export type WebLevel = 'beginner' | 'intermediate' | 'advanced' | 'track_leader';

export type UserGender = 'female' | 'male';

export interface UserSettings {
  fontSize: number; // e.g. 17
  theme: 'light' | 'dark' | 'auto';
  language: 'ar' | 'en';
  reducedMotion: boolean;
  eyeComfort: boolean; // beige soothing background
  celebrations: boolean; // confetti
  soundEnabled: boolean; // web audio chimes & pops
  highContrast: boolean;
}

export interface MemberSkillItem {
  id?: string | number;
  name: string;
  progressPercent: number; // 0 - 100
  status: 'approved' | 'in_progress' | 'upcoming';
  source: 'self' | 'approved_by_leader';
  category?: 'frontend' | 'tools' | 'languages' | 'design' | 'other';
  awardedAt?: string;
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  awardedAt?: string;
  reason?: string;
  pointsRequired?: number;
}

export interface UserStats {
  workshopsCompleted: number;
  challengesCompleted: number;
  projectsCompleted: number;
  initiativesCount: number;
}

export interface ActiveMemberRanking {
  member: UserProfile;
  weekPoints: number;
  monthPoints: number;
  weekRank: number;
  monthRank: number;
  activityBreakdown: {
    workshops: number;
    challenges: number;
    projects: number;
    community: number;
  };
}

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  gender: UserGender;
  role: UserRole;
  roleTitle: string;
  webLevel: WebLevel;
  webLevelTitle: string;
  levelNumber: number; // 1, 2, 3
  points: number;
  avatarLetter: string;
  badgeColor: string;
  major: string;
  academicYear: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  onboarded_at?: string | null; // null triggers mandatory bio screen
  last_phrase_id?: string | null; // prevents duplicate consecutive greetings
  skills: string[]; // e.g. ['HTML', 'CSS']
  detailedSkills?: MemberSkillItem[];
  badges?: BadgeItem[];
  stats?: UserStats;
  completedStages: number[]; // e.g. [1]
  currentStage: number; // e.g. 2
  settings: UserSettings;
}

export type NotificationType =
  | 'points'
  | 'workshop'
  | 'task'
  | 'poll'
  | 'inquiry_reply'
  | 'review_result';

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  badgeText?: string;
  pointsAmount?: number;
  targetTab?: NavTab;
  createdAt: string;
  read: boolean;
}

export type NavTab =
  | 'home'
  | 'journey'
  | 'challenges'
  | 'lab'
  | 'showcase'
  | 'community'
  | 'profile'
  // Leader specific tabs
  | 'overview'
  | 'members'
  | 'content'
  | 'submissions'
  | 'polls_mgmt'
  | 'points_mgmt'
  | 'evaluations';

export interface ActionItem {
  id: string;
  type: 'poll' | 'workshop' | 'task' | 'learn';
  typeLabel: string;
  title: string;
  subtitle: string;
  dueText: string;
  actionText: string;
  actionType: 'answer' | 'register' | 'open' | 'start';
  targetTab: NavTab;
  completed?: boolean;
}

export interface DayActivity {
  id: string;
  type: 'workshop' | 'task' | 'poll';
  title: string;
  time?: string;
  color: string; // '#34A853' workshop, '#F9AB00' task, '#4285F4' poll
}

export interface WeeklyDay {
  date: string; // YYYY-MM-DD
  dayName: string; // ح, ن, ث, ر, خ, ج, س
  dayFullName: string; // الأحد, الاثنين, etc.
  dateNumber: number; // 4, 5, 6, 7, 8, 9, 10
  isToday?: boolean;
  activities: DayActivity[];
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  scheduledAt: string; // ISO string
  imageUrl?: string;
  registrationUrl?: string;
  topics: string[];
  tasks: string[];
  createdBy?: string;
  createdAt?: string;
}

export interface WelcomePhrase {
  id: string;
  text_m: string;
  text_f: string;
  category: 'general' | 'morning' | 'evening' | 'streak' | 'achievement';
  active: boolean;
}

export interface CourseSource {
  platform: 'satr' | 'youtube' | 'official' | 'codelab';
  platformName: string;
  title: string;
  outcome: string;
  url: string;
}

export type CourseCategory =
  | 'languages'
  | 'tracks'
  | 'frameworks'
  | 'hosting_tools'
  | 'foundation'
  | 'recommended';

export interface CourseSubLevel {
  id: string;
  title: string;
  url: string;
  level: string;
  outcome?: string;
}

export interface Course {
  id: string;
  title: string;
  symbol: string; // e.g. '</>', '#', 'JS', '⎇'
  color: 'blue' | 'red' | 'green' | 'yellow';
  category: CourseCategory;
  levelRequirement: string; // "إجبارية للمبتدئ، واختيارية لمستواك"
  status: 'not_started' | 'in_progress' | 'in_review' | 'completed';
  sources: CourseSource[];
  projectRepoUrl?: string;
  skillReward: string; // e.g. 'CSS'
  description?: string;
  directUrl?: string;
  isRecommendedTrack?: boolean;
  subLevels?: CourseSubLevel[];
}

export interface NextMission {
  id: string;
  title: string;
  summary?: string;
  details?: string;
  stageName?: string;
  badgeLevel?: string;
  dueDate?: string;
  dueText?: string;
  actionText?: string;
  points: number;
  tags?: string[];
  color?: 'blue' | 'red' | 'green' | 'yellow';
}


export type InquiryStatus = 'new' | 'in_progress' | 'answered';

export interface Inquiry {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  details: string;
  status: InquiryStatus;
  responseText?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
}

export interface PollCustomAnswer {
  userId: string;
  userName: string;
  text: string;
  votedAt: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  allowCustom: boolean;
  customAnswers: PollCustomAnswer[];
  isAnonymous: boolean;
  closesAt: string;
  pointsReward: number;
  isActive: boolean;
  totalVotes: number;
}

export interface PollVoteRecord {
  pollId: string;
  userId: string;
  optionId?: string;
  customText?: string;
  votedAt: string;
  awardedPoints: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  tag: string;
  date: string;
  priorityColor: 'blue' | 'red' | 'green' | 'yellow';
}

export interface MemberSubmission {
  id: string;
  taskTitle: string;
  submittedAt: string;
  status: 'in_review' | 'approved' | 'revision_requested';
  feedback?: string;
  score?: number;
}

// =============================================================================
// Challenge Groups & Multi-Option Tasks Specification (Architecture Section 3)
// =============================================================================
export type ChallengeCategory = 'workshop' | 'side_learn' | 'side_fun' | 'general';
export type ChallengeMode = 'mandatory' | 'choice';

export interface ChallengeOption {
  id: string;
  groupId: string;
  name: string;
  description: string;
  requirements: string; // ما المطلوب بالتحديد
  points: number;
}

export interface ChallengeGroup {
  id: string;
  title: string;
  workshopId?: string;
  workshopTitle?: string;
  category: ChallengeCategory;
  dueDate: string;
  mode: ChallengeMode;
  options: ChallengeOption[];
  createdAt?: string;
}

export interface ChallengeChoice {
  id: string;
  memberId: string;
  groupId: string;
  optionId: string;
  submitted: boolean;
  repoUrl?: string;
  liveUrl?: string;
  updatedAt: string;
}

export interface LabChallenge {
  id: string;
  title: string;
  description: string;
  instruction: string;
  points: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  levelLabel: string;
  defaultHtml: string;
  defaultCss: string;
  defaultJs: string;
  solutionHint?: string;
  badgeColor?: string;
}



