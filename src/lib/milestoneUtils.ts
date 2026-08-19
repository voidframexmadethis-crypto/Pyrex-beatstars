// PyrexSpinna Milestone & Plaque Tier Progression Tracker
export interface Milestone {
  tier: number;
  name: string;
  streamThreshold: number;
  plaqueUnlocked: boolean;
  plaqueType?: string;
  status: string;
}

export const PyrexSpinnaMilestones: Milestone[] = [
  {
    tier: 1,
    name: "Independent Kickoff",
    streamThreshold: 100,
    plaqueUnlocked: false,
    status: "Achieved"
  },
  {
    tier: 2,
    name: "Standard Tier",
    streamThreshold: 800,
    plaqueUnlocked: false,
    status: "Achieved"
  },
  {
    tier: 3,
    name: "Growth Milestone",
    streamThreshold: 1255,
    plaqueUnlocked: false,
    status: "Achieved"
  },
  {
    tier: 4,
    name: "Heavy Rotation",
    streamThreshold: 100000,
    plaqueUnlocked: true,
    plaqueType: "Gold Certified Edition",
    status: "Unlocked"
  },
  {
    tier: 5,
    name: "Elite Enterprise Status",
    streamThreshold: 1002000,
    plaqueUnlocked: true,
    plaqueType: "Diamond Million-Stream Masterpiece",
    status: "Top Tier Target"
  }
];

// Progress Calculator Function
export function checkCurrentMilestone(totalStreams: number): Milestone {
  const current = [...PyrexSpinnaMilestones].reverse().find(m => totalStreams >= m.streamThreshold);
  return current || PyrexSpinnaMilestones[0];
}
