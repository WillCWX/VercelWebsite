# Personal Website

Made to display various projects I have done.

### Tech Stack

[![Frontend CI](https://github.com/WillCWX/VercelWebsite/actions/workflows/frontend_ci.yml/badge.svg)](https://github.com/WillCWX/VercelWebsite/actions/workflows/frontend_ci.yml)
![Vercel Deploy](https://deploy-badge.vercel.app/vercel/vercel-website-willcwxs-projects)

[Next.js](https://nextjs.org/) bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

DevOps with [Docker](), [Git](), [Github]().

Linting with [EsLint](), [Prettier](), [Husky]().

Currently on [Vercel](https://vercel) deployment for production .
Docker deployment for testing.

### Development

1. Install dependencies with `npm i`
2. Prepare husky with `npm run husky`
3. Run hot development server with `npm run dev`
4. Access the webapp at [http://localhost:3000](http://localhost:3000)

Linting and formatting is done automatically by husky during a git commit.

If husky cannot be installed, lint and format with `npm run lint`.

### Deployment

- Vercel Deployment

  - Automatically done when pushed to main
  - Access at [williamcwx.com](https://williamcwx.com)

- Docker Container (HTTP)

  - Create the container with `docker build . -t webapp`
  - Run the containter with `docker run -p 3000:3000 webapp:latest`
  - Access the webapp at [http://localhost:3000](http://localhost:3000)
  - Teardown unused containers with `docker container prune`
  - Teardown excess images with `docker image prune`

- Docker Container (HTTPS)

  - Create the directory `./.secrets`
  - Create the file `./.secrets/cloudflare.ini` and [define the api token](https://certbot-dns-cloudflare.readthedocs.io/en/stable/)
  - Redefine `nginx.conf` cert path and `docker-compose.yml`'s `certbot` if FQDN changes
  - Create and run the containers with `docker compose up` (`-d` for background)
  - Access the webapp at [test.williamcwx.com](https://test.williamcwx.com) or the new FQDN
  - Teardown the containers with `docker compose down`

- Build & Serve
  - Install dependencies with `npm ci` (clean install)
  - Build with `npm run build`
  - Serve with `npm run start`
  - Access the webapp at [http://localhost:3000](http://localhost:3000)
  - Stop with `ctrl+c`

### To Do List

- Add Chess AI project into website
- Add Budgeting java project into website
