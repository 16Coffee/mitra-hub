# mitra-hub

Skill hub for the **Mitra** desktop creation workbench. The app's skill server
(`apps/server/src/skill-hub.ts`) reads this repo over the public GitHub API and
installs skills on demand into a workspace's `.opencode/skills/`.

## Layout

```
skills/
  <skill-name>/
    SKILL.md        # required entrypoint: frontmatter (name + description) + body
    ...             # optional bundled references / scripts / assets
```

The `name` in each `SKILL.md` frontmatter **must equal** its directory name, or
the listing drops it.

## Skills

| Skill | What it gives the agent |
|-------|-------------------------|
| `remotion` | Create and render videos programmatically (React-based video → mp4). |
| `shadcn` | Add, search, fix, and compose shadcn UI components. |
| `browser-setup-devtools` | Guide the user through browser-automation setup via the Chrome DevTools MCP. |

## How install works

`GET /hub/skills` lists every `skills/*/` directory; installing a skill copies
all files under `skills/<name>/` into the target workspace. Updating a skill =
push to this repo; no app rebuild required.
