import { BriefcaseType } from '../types';
import { Briefcase } from './Briefcase';

interface CasesGridProps {
  cases: BriefcaseType[];
  myCaseId: number | null;
  onSelectCase: (id: number) => void;
  disabled: boolean;
  isMagicModeActive?: boolean;
}

export function CasesGrid({ cases, myCaseId, onSelectCase, disabled, isMagicModeActive }: CasesGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-x-6 gap-y-10 mt-4 mx-auto p-4 justify-items-center">
      {cases.map((c) => (
        <Briefcase
          key={c.id}
          id={c.id}
          amount={c.amount}
          isRevealedByMagic={c.isRevealedByMagic}
          isMagicModeActive={isMagicModeActive}
          isOpened={c.isOpened}
          isSelected={myCaseId === c.id}
          onClick={() => onSelectCase(c.id)}
          disabled={disabled || (!isMagicModeActive && myCaseId === c.id && cases.filter(x => !x.isOpened).length > 2)}
        />
      ))}
    </div>
  );
}
