export interface SplitAgreement {
  collaboratorId: string;
  publishingShare: number; // percentage
  masterShare: number;     // percentage
}

export function validateSplits(splits: SplitAgreement[]): boolean {
  const totalPub = splits.reduce((sum, s) => sum + s.publishingShare, 0);
  const totalMaster = splits.reduce((sum, s) => sum + s.masterShare, 0);
  return Math.abs(totalPub - 100) < 0.01 && Math.abs(totalMaster - 100) < 0.01;
}
