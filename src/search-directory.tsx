// src/search-directory.tsx
import React, { useState, useEffect, useRef } from "react";
import { List, ActionPanel, Action, getPreferenceValues } from "@raycast/api";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

interface Preferences {
  searchDir1: string;
  searchDir2?: string;
  searchDir3?: string;
  searchDir4?: string;
  searchDir5?: string;
  searchDir6?: string;
  searchDir7?: string;
  searchDir8?: string;
  searchDir9?: string;
  searchDir10?: string;
}

export default function Command() {
  const prefs = getPreferenceValues<Preferences>();
  const dirs = [
    prefs.searchDir1,
    prefs.searchDir2,
    prefs.searchDir3,
    prefs.searchDir4,
    prefs.searchDir5,
    prefs.searchDir6,
    prefs.searchDir7,
    prefs.searchDir8,
    prefs.searchDir9,
    prefs.searchDir10,
  ].filter(Boolean) as string[];

  const [selectedDir, setSelectedDir] = useState<string>(dirs[0] || "");
  const [searchText, setSearchText] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const procRef = useRef<ChildProcessWithoutNullStreams>();

  useEffect(() => {
    procRef.current?.kill();

    // Always run search, even when searchText is empty
    setResults([]);

    const cmd = `
       export fzf="/opt/homebrew/bin/fzf";
       find '${selectedDir}' -type f -o -type d \
         | fzf --ignore-case --filter='${searchText}'
     `;
    const proc = spawn("bash", ["-lc", cmd], {
      env: { ...process.env, PATH: `/opt/homebrew/bin:${process.env.PATH}` },
    });
    procRef.current = proc;

    proc.stdout.on("data", (chunk: Buffer) => {
      setResults((prev) => [...prev, ...chunk.toString().split("\n").filter(Boolean)]);
    });

    return () => {
      proc.kill();
    };
  }, [searchText, selectedDir]);

  return (
    <List
      searchBarPlaceholder="Type to search…"
      onSearchTextChange={setSearchText}
      throttle
      searchBarAccessory={
        <List.Dropdown tooltip="Select Directory" onChange={setSelectedDir} storeValue={false}>
          {dirs.map((dir) => (
            <List.Dropdown.Item key={dir} value={dir} title={dir.split("/").pop()!} />
          ))}
        </List.Dropdown>
      }
    >
      {results.map((path) => (
        <List.Item
          key={path}
          title={path.split("/").pop()!}
          subtitle={path}
          icon={{ fileIcon: path }}
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
