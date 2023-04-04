# Mapper - Visualizing the World through Data-driven Lenses

Mapper is an interactive data visualization platform designed to provide users with unique insights into various aspects of our world. By harnessing the power of rich datasets, Mapper allows users to view the world through different economic, political, and geographic lenses.

Through an intuitive interface centered around a map, users can easily explore and analyze key economic indicators such as GDP, personal income, and immigration, revealing patterns and trends that shape our society. Mapper is dedicated to fostering a deeper understanding of the world around us, helping users make informed decisions and develop a greater appreciation for the complexities of our global community.

## Installation

### First Steps
Copy `.env-sample` into `.env`  
Replace each `CHANGEME` value as appropriate.

### Postgres Setup
Run `docker-compose up -d` to start the database after your .env has been configured properly.

### Prisma Setup
First, run 

    npm install

Then, generate your prisma artifacts (your Prisma Client).

    npx prisma generate

Next, you'll need to seed your database.

    npm run db-seed

### Running locally in development mode

Launch the app with `npm run dev`;

## Dependencies 

Primary dependencies:
- NodeJS 18+


> If you are not familiar with the different technologies used in this project, please refer to the respective docs. 
- [React](https://react.dev/)
- [NextJS](https://nextjs.org/docs)
- [Next-Auth.js](https://next-auth.js.org/getting-started/introduction)
- [Prisma](https://www.prisma.io/docs/)
- [TailwindCSS](https://tailwindcss.com/docs/utility-first)
- [tRPC](https://trpc.io)
- [ZOD](https://zod.dev/)
- [Discord Auth](https://discord.com/developers/docs/topics/oauth2)

## Contributing Guide

### Issues/Merge Requests 
When creating a branch, ensure that you have a few select issue(s) in mind that the branch is intended to resolve. No major suggestions on branch names, though I suggest giving a name directly instead of creating a name off of the issue. Once your branch is made, create a merge request (tagging it as `Draft:`) for your branch, and include the names of the issues the merge request is intended to resolve (using the `Resolves Issues x...` format)..

### DB Changes
When making changes to the database:
- Standup your own local database to test out changes before performing them on the developer database.
- Any feature branch should have at most **ONE** migration file for changes to the DB. Use one of the following two options to make sure this is the case. 

#### [Schema prototyping with db push](https://www.prisma.io/docs/guides/database/prototyping-schema-db-push)

- When testing out potential schema changes in `schema.prisma`, you may use the `npx prisma db push` command to update the db's state with your prisma before documenting anything with migration files. Once you've finalized your changes, use `npx prisma migrate dev --name=YOUR_MIGRATION_NAME` to document the change with a formal migration file. 

#### [Squash migrations in development environment](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/squashing-migrations#how-to-migrate-cleanly-from-a-development-environment)

- If you have multiple migrations that need to be squashes, reset your `migrations/` directory to look like what's currently in our `main` branch.
- Then, create a single migration with `npx prisma migrate dev --name your_migration_name`

### Code Styling/Syntax
- Standardize on arrow function syntax for better readability
- Define props using the ({prop}:{proptype}) destructuring format for better readability
- Use absolute imports outside of the /screen directories
- Use common, reusable components where appropriate. Add variants through props to fit your needs
- Try to keep things in tailwind, but more importantly, remember that in react we're styling on a component-by-component basis.
  that means a button in /common/ has set classes defined for it, and you should only use those that are defined (and if yours is custom
  simply add it in as an option via a prop and then use clsx to apply it conditionally)
- Keep branch history clean by deleting source branches on merge and mention relevant gitlab issues on any merge request 
- Keep branch names somewhat direct and applicable, but more importantly attempt to get branches/merge-requests as specific as possible. The smaller the merge request,
  the better as it makes us more likely to actually review it as a team and make sure it's good (this was hard as we first started, but should get easier as we progress).
- Document reusable components and utilities so that their purpose is understood

### Vscode/Prettier/Eslint Setup

> If you want to better adhere to our linting/prettier requirements, you can configure prettier-eslint as your default formatter, and even have vscode setup to automatically format a file using that configuration each time you save. 
- First, make sure that you install the `ESLint `and `Prettier ESLint` extensions for Vscode. 
- Next, find any .tsx file and use `ctrl + shift + p` to enter the Command Palette and select `Format document with`
- Next select `Configure default formatter`
- Finally, choose `Prettier ESLint` from the list
- You should be good to go. Restart your vscode server for good measure, and now Prettier ESLint should be your default formatter. Follow this example with other file extensions as you find appropriate. 
- [Optional: Enable Formatting On Save](https://blog.yogeshchavan.dev/automatically-format-code-on-file-save-in-visual-studio-code-using-prettier)


## Background
This project was bootstrapped with `create-t3-app` which is based on the [T3 Stack](https://create.t3.gg/). 

