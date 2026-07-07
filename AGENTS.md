# deployment-poc

A practice repo for building a CI/CD pipeline with GitHub Actions, using ports & adapters to make persistence swappable across environments (dev → test → acceptance → production).

## Agent skills

### Issue tracker

Issues and PRDs are tracked as GitHub issues (via the `gh` CLI) on `david-iwdb/deployment-poc`. External PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical labels, default names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
