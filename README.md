# Armitage Monorepo

## Getting Started

This repository contains the following packages:

- `/` - The Next.js app that runs the Armitage dashboard
- `/cred-manager` - The Nest.js app that runs the Armitage SourceCred instance on your local machine.

Unless you are already familiar with SourceCred and have an instance running on your environment, you should run the cred-manager via docker;

### Setup

You will need to have the following installed on your machine:
`docker compose`
`yarn`
`supabase cli`

First, copy the `.env.example` file to `.env` and fill in the necessary environment variables, if you don't have a postgres instance running, we will cover that next for the DATABASE_URL variables

For the database, install the `supabase` [CLI](https://supabase.com/docs/guides/cli/getting-started) and run the following command on the root of the project:
```bash
supabase start
```
The supabase CLI should output the information about your local instance. If you changed any of the default values, you should update the `.env` file with the new values accordingly.


Then, install dependencies of the nextJs app, and generate the prisma client to interact with the database with:
```bash
yarn install
yarn prisma db push
```

After installing the dependencies you can run the NextJs app and the NestJs app with the following commands:

```bash
yarn dev && docker-compose up
```


Open [http://localhost:3000](http://localhost:3000) with your browser and you should see the application being served.


## Resources

We recommend getting familiar with SourceCred and the following resources:

https://research.protocol.ai/blog/2020/sourcecred-an-introduction-to-calculating-cred-and-grain/
https://medium.com/sourcecred/network-formation-games-7a74491abf0e
https://medium.com/sourcecred/exploring-subjectivity-in-algorithms-5d8bf1c91714
https://medium.com/sourcecred/the-dao-missing-link-reputation-protocols-8e141355cef2
https://hackmd.io/@mzargham/SkY7VvQnV?type=view

## Contributing

This is a new project and we still don't have a contribution guide, but we highly encourage contributions and suggestions. If you are interested in contributing, please reach out to us on the Armitage Discord server or create a new issue/discussion on this repository.
Please make sure to check the Request for Contributions (RFC) and the issues/discussions tab to see if there is any ongoing work that you can help with.

### UI components
https://ui.shadcn.com/
https://next-shadcn-dashboard-starter.vercel.app/dashboard
https://ui.aceternity.com/
