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

| Skill | What it gives the agent | Audience |
|-------|-------------------------|----------|
| `remotion` | Create and render videos programmatically (React-based video → mp4). | end user |
| `shadcn` | Add, search, fix, and compose shadcn UI components. | end user |
| `browser-setup-devtools` | Guide the user through browser-automation setup via the Chrome DevTools MCP. | end user |
| `browser-automation` | Attach OpenCode browser tools to the Mitra Electron app during local development and drive its UI over CDP. | developing Mitra |
| `daytona-dev` | Launch the full Mitra stack in a Daytona cloud sandbox (noVNC). | developing Mitra |
| `get-started` | Scripted first-run onboarding + Chrome DevTools demo. | onboarding |

Descriptions are honest about audience, so an end-user agent won't load the
dev-only skills and a developer agent will.

## How install works

`GET /hub/skills` lists every `skills/*/` directory; installing a skill copies
all files under `skills/<name>/` into the target workspace. Updating a skill =
push to this repo; no app rebuild required.
