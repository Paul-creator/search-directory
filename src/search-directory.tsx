// src/search-directory.tsx
import React, { useState, useEffect, useRef } from "react";
import { List, ActionPanel, Action, getPreferenceValues } from "@raycast/api";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

interface Preferences {
  searchDir: string;
}

export default function Command() {
  const { searchDir } = getPreferenceValues<Preferences>();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const procRef = useRef<ChildProcessWithoutNullStreams>();

  useEffect(() => {
    procRef.current?.kill();
    if (!searchText) return setResults([]);
    setResults([]);
    // Pfad zu deinem Homebrew-fzf (ggf. anpassen) und Shell-Quoting
    const cmd = `
       export fzf="/opt/homebrew/bin/fzf";
       find '${searchDir}' -type f -o -type d \
         | fzf --filter='${searchText}' --no-sort
     `;
    const proc = spawn("bash", ["-lc", cmd], {
      env: { ...process.env, PATH: `/opt/homebrew/bin:${process.env.PATH}` },
    });
    console.log(cmd);

    procRef.current = proc;
    proc.stdout.on("data", (chunk: Buffer) => {
      setResults((prev) => [...prev, ...chunk.toString().split("\n").filter(Boolean)]);
    });
    return () => {
      proc.kill();
    };
  }, [searchText, searchDir]);

  return (
    <List searchBarPlaceholder="Type to search…" onSearchTextChange={setSearchText} throttle>
      {results.map((path) => (
        <List.Item
          key={path}
          title={path.split("/").pop()!}
          subtitle={path}
          actions={
            <ActionPanel>
              <Action.Open title="Open File" target={path} />
              <Action.ShowInFinder title="Reveal in Finder" path={path} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
