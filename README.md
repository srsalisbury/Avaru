# Avaru Racing website

Static site for Avaru Racing. No build step: every page is plain HTML with its styles inline.

## Pages
| File | Page |
|---|---|
| `index.html` | Home |
| `fleet.html` | Fleet: every ship is an expandable entry here (copy the Aeres entry for a new ship) |
| `story.html` | Our story |
| `races.html` | Races |
| `partners.html` | Partners |
| `join.html` | Join the team |

`assets/` holds the logos and the background grid. Fonts (Michroma, Tektur, Inter) load from Google Fonts.

## Classified pages
Ship pages that have not been revealed yet are named `<ship>.classified.html` and their photos go in `assets/classified/`. Git ignores both (see `.gitignore`), so they never reach GitHub or the live site. To reveal a ship, rename its page to `<ship>.html`, move its photos into `assets/`, and link to it from the other pages.

## Publishing with GitHub Pages
1. Push these files to the root of a repository.
2. In the repository, open **Settings › Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. The site appears at `https://<your-username>.github.io/<repository-name>/` after a minute or two.

## Still to fill in
- Discord invite and YouTube channel links (search for `discord.gg/` and `youtube.com/`).
- The Workshop link (search for `#workshop`).
- Anything in square brackets, such as race dates, tracks and the debut race.
- The contact and partner forms show the layout only: connect them to a form service (for example Formspree) to receive submissions.
