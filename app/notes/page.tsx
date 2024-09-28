import { Keyword } from "@/components/Keyword";
import { DocsLink } from "@/components/Links/DocsLink";
import { InternalLink } from "@/components/Links/InternalLink";
import {
  LucideChevronLeft,
  LucideDot,
  LucideNotebook,
  LucideSection,
} from "lucide-react";
import { PropsWithChildren } from "react";

function Heading1({ children }: PropsWithChildren) {
  return (
    <h1 className="flex items-center gap-2 text-3xl font-bold mb-12">
      {children}
    </h1>
  );
}

function Section({ children }: PropsWithChildren) {
  return (
    <section className="p-4 mb-[500px] border-2 rounded-xl border-t-red-500 border-b-amber-500 border-x-orange-500">
      {children}
    </section>
  );
}

function SectionTitle({ children }: PropsWithChildren) {
  return (
    <h2 className="flex items-center gap-2 text-xl font-bold my-4">
      <LucideSection size="20" />
      {children}
    </h2>
  );
}

function Subtitle({ children }: PropsWithChildren) {
  return (
    <h3 className="flex items-center gap-2 mt-8 mb-2">
      <LucideDot />
      {children}
    </h3>
  );
}

function Paragraph({ children }: PropsWithChildren) {
  return (
    <h1 className="leading-relaxed text-sm text-zinc-300 mb-3">{children}</h1>
  );
}

export default function NotesPage() {
  return (
    <div className="flex flex-col items-center py-24 px-4">
      <div className="flex flex-col max-w-[550px] w-full">
        <InternalLink
          href="/"
          className="mb-4 flex gap-1 items-center text-zinc-500"
        >
          <LucideChevronLeft size="20" />
          Back
        </InternalLink>

        <Heading1>
          <LucideNotebook />
          Notes
        </Heading1>

        <Section>
          <SectionTitle>Tanstack Query</SectionTitle>

          <Paragraph>
            Tanstack Query is state-management library meant to sit cozily
            between your network and app / UI layers.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>What is a Query™?</SectionTitle>

          <Paragraph>
            A function that returns data, and a key under which that data is
            stored and updated.
          </Paragraph>

          <Paragraph>
            Queries can become <Keyword>Stale</Keyword> after a certain amount
            of time has passed. Different behavior can be configured to handle
            stale data.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>What is a Query Invalidation?</SectionTitle>

          <Paragraph>
            Invalidation means marking the data under a query key{" "}
            <Keyword>Stale</Keyword>
          </Paragraph>

          <Subtitle>
            What does it mean for data to <Keyword>Stale</Keyword>?
          </Subtitle>

          <Paragraph>
            This just means that a certain amount of time has passed since the
            data was last <Keyword>fetched</Keyword> or{" "}
            <Keyword>refetched</Keyword>.
          </Paragraph>

          <Subtitle>
            What is <Keyword>Fetching</Keyword>?
          </Subtitle>

          <Paragraph>Getting data for the first time.</Paragraph>

          <Subtitle>
            What is <Keyword>Refetching</Keyword>?
          </Subtitle>

          <Paragraph>
            Getting data after at least one <Keyword>Fetch</Keyword>
          </Paragraph>

          <Subtitle>
            When does <Keyword>Refetching</Keyword> occur?
          </Subtitle>

          <Paragraph>
            <ul>
              <li>1. When triggered manually.</li>

              <li>
                2. When it{`'`}s configured to run on <Keyword>Stale</Keyword> data
                and a query is invalidated.
              </li>
            </ul>
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>What are Query Keys</SectionTitle>

          <Paragraph>
            A list of strings used as a hashmap key to store data for a given
            query. Later, these keys are used for managing the cache and
            invalidating query data.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>How to Query Keys?</SectionTitle>

          <Subtitle>1. Inline them 🙈</Subtitle>

          <Paragraph>
            I mean what{`'`}s so bad about magic strings, really?
          </Paragraph>

          <Subtitle>2. Use a library</Subtitle>

          <Paragraph>
            The{" "}
            <DocsLink href="https://github.com/lukemorales/query-key-factory">
              query key factory
            </DocsLink>{" "}
            community package is endorsed by the official tanstack query site.
          </Paragraph>

          <Subtitle>3. Use Key Factories</Subtitle>

          <Paragraph>
            Follow the official{" "}
            <DocsLink href="https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories">
              tanstack query docs
            </DocsLink>
          </Paragraph>
        </Section>
      </div>
    </div>
  );
}
