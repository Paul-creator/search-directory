// src/search-directory.tsx
import React, { useState, useEffect } from "react";
import { List, ActionPanel, Action, getPreferenceValues } from "@raycast/api";
import { exec } from "child_process";

interface Preferences {
  searchDir: string;
}

export default function Command({
  arguments: { query },
}: {
  arguments: { query: string };
}) {
  const { searchDir } = getPreferenceValues<Preferences>();
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (!query) return setResults([]);
    exec(`mdfind -onlyin "${searchDir}" "${query}"`, (err, stdout) => {
      if (err) return setResults([]);
      setResults(stdout.split("\n").filter(Boolean));
    });
  }, [query, searchDir]);

  return (
    <List searchBarPlaceholder="Type to search…" throttle>
      {results.map((path) => (
        <List.Item
          key={path}
          title={path.split("/").pop() || path}
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
