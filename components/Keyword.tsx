import { ReactNode } from "react";

type KeywordProps = {
  children: ReactNode;
};

export function Keyword({ children }: KeywordProps) {
  return <pre className="inline border px-1 py-0.5 rounded">{children}</pre>;
}
