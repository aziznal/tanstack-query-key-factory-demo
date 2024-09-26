import { Keyword } from "@/components/Keyword";
import { DocsLink } from "@/components/Links/DocsLink";
import { ExternalLink } from "@/components/Links/ExternalLink";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] mx-4">
      <h1 className="font-bold text-lg mb-2">
        <ExternalLink href="https://tanstack.com/query/latest">
          Tanstack Query
        </ExternalLink>{" "}
      </h1>

      <p className="text-2xl text-zinc-800 font-bold mb-2">Key Factory Demo</p>

      <div className="flex gap-4 items-center text-xs mb-4">
        <DocsLink
          href="https://tanstack.com/query/latest/docs/framework/react/guides/query-keys"
          title="The official docs for query keys"
        >
          query keys
        </DocsLink>

        <DocsLink
          href="https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories"
          title="Effective usage of query keys by the creator of the library himself"
        >
          key factories
        </DocsLink>

        <DocsLink
          href="https://github.com/lukemorales/query-key-factory"
          title="A community package for query key factories"
        >
          community package
        </DocsLink>
      </div>

      <div className="mb-4 text-center max-w-[500px] text-sm text-zinc-500">
        In this demo, I demonstrate how key factories work for{" "}
        <Keyword>creating</Keyword>, <Keyword>updating</Keyword>,{" "}
        <Keyword>deleting</Keyword>, and <Keyword>invalidating</Keyword> queries
        and query data.
      </div>

      <div className="flex flex-col border p-3 rounded-sm">
        <div>foo</div>
      </div>
    </div>
  );
}
