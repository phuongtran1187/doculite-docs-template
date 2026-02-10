interface StepsProps {
  children: React.ReactNode;
}

export function Steps({ children }: StepsProps) {
  return (
    <div className="steps mb-12 ml-4 border-l pl-8 [counter-reset:step]">
      {children}
    </div>
  );
}
