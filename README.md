# E-TECH CREATIVES Static Website

Premium responsive static website for E-TECH CREATIVES.

## Files

- `index.html` - website markup and page sections
- `style.css` - responsive styling, layout, animations, and visual system
- `script.js` - mobile menu, sticky header, scroll reveal, form validation, and back-to-top behavior
- `assets/logo/e-tech-logo.jpeg` - logo copied from the original asset
- `assets/images/` - local hero and service images
- `assets/icons/` - ready for future icon assets

## How to Open

Open `index.html` directly in a browser. No build step, server, or framework is required.

## Contact Details Used

- Phone: `0795018886`
- Email: `etechcreatives@mail.com`
- Website: `www.etechcreatives.co.ke`

## Production deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` publishes the website
after every push to `main`. Saving a file locally does not publish it: commit and
push your changes, or use your editor's Git Sync command.

```powershell
git add index.html style.css script.js assets
git commit -m "Update website"
git push origin main
```

In the repository's **Settings > Pages**, select **GitHub Actions** as the source
and set the custom domain to `etechcreatives.co.ke`. The `CNAME` file documents the
domain, but Actions deployments require the domain to be set in Pages settings too.

At the domain's DNS provider, configure these records:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | EdwardSalonikMosieny.github.io |

Replace conflicting website records for `@` and `www`; preserve email MX and TXT
records. Remove stale AAAA records or replace them with GitHub's documented IPv6
addresses. If CAA records restrict certificate issuers, allow `letsencrypt.org`.

After GitHub validates DNS and issues its certificate, enable **Enforce HTTPS** in
Pages settings. Certificate availability can take up to 24 hours. Check both
`https://etechcreatives.co.ke/` and `https://www.etechcreatives.co.ke/`, then verify
HTTP redirects to HTTPS. Keep external scripts, styles, and images on HTTPS to
avoid mixed content. GitHub manages certificate renewal while DNS stays correct.

Deployment progress and failures appear under the repository's **Actions** tab.
Use **Run workflow** there to redeploy without changing the website.

Reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
