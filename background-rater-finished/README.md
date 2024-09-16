This is an example AI application that uses [Inngest](https://www.inngest.com/) to choreograph the long running AI jobs.

## Getting Started

Follow these steps to get started with the project:

1. Install the dependencies:

```bash
pnpm install
```

2. Setup your environment variables:

```bash
cp .env.example .env.development.local
```

Then, open the `.env.development.local` file and fill in the required environment variables.

- You'll also need an `OPENAI_API_KEY` to access the OpenAI API.
- You'll need all the `POSTGRES_*` variables from the Vercel dashboard to access the Vercel Postgres API. The Vercel Postgres API is used to store the current backgrounds and their status.
- You'll need a `BLOB_READ_WRITE_TOKEN` variables from the Vercel dashboard to access the Vercel Blob API. The Vercel Blob API is used to store the uploaded images.

You can get all the Vercel variables by using the Vercel CLI:

```bash
vercel env pull
```

2. Initialize the database

```bash
psql "<YOUR POSTGRES_URL>" -f src/db/schema.psql
```

3. Run Inngest locally in another terminal window:

```bash
npx inngest-cli@latest dev --no-discovery -u http://localhost:3000/api/inngest
```

And open the [Inngest dashboard](http://127.0.0.1:8288/stream).

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
