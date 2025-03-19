# Crew Center - [employee directory assignment]

This is my attempt to have an employee directory web app with Speedlane's suggested features.

I want to try and implement all of the features, and maybe add some more if I have time.

## Suggested Features

- Setup instructions and notes on how you built the application.
- Use of a front end framework, ideally React.
- Modern API, we commonly use Node in-house.
- Ability to display employees by department, title, location, etc.
- Use of a client-side router.
- Creative use of animation.
- Paginated lists.
- Forms for creating, updating, and deleting employees.
- Source data from a third party person API, such as [ramdomuser.me](https://randomuser.me) ~~or [uifaces](http://uifaces.com)~~.
- Ability to search for employees.
- Testing.

## Brainstorming Session

- I want to provide a solution in a short amount of time that's needs to be production ready.
- It appears that it's preferable to use nodejs for the backend.
- They are asking for Modern API, they also had a question about GraphQL during the interview. Should I risk trying to learn it or use something that I am more familiar with?
- I am think of using React for the front end, win-win since I have been enjoying it and the requirements say that's the best option for this assignment.
- Requirements also suggest focusing on one section either frontend or backend. What does a generalist do?
- what should the repo structure / strategy be? if am going to use typescript everywhere, maybe i can benefit from a monorepo? there are no requirements for different tech stacks or microservices. monorepo can be faster given the my limited time. What are my options for a monorepo?
- they want persistent storage (when creating new users)but also use source data from a third party API. Do i generate source data once then save in the project DB or do I get a new random source data everytime?
- do i need state management? what do i go with?
- do i use nextjs or something lighter? during the interview them mentioned that there might be legacy code, they are also asking for client side router,I am assuming they want me to write code for a router, so maybe they are not looking for a file-base routing, so not sure of the benefits of nextjs especially since im thinking of using nestjs for the backend.
- catchy app name?
- testing, anything similar to nUnit, xUnit?
- do we need cqrs?

## Resolution

### App Name

**"Crew Center"**

(can also do a gimick on the homepage for **cc** like an email, since it's like an employee directory app)

### Teck Stack

#### Frontend

- React ~~18 with Vite~~ nextjs (comes with turborepo)
- TypeScript
- TailwindCSS for styling
- React Query for server state management
- React Router v6 for routing
- Zod for schema validation
- testing ?
- Framer Motion for animations (maybe)
- React Hook Form for form handling (maybe)

#### Backend

- NestJS (closest to a .net environment with SOLID principles etc)
- TypeScript
- Zod schema validation with Pipeline + filter ~~Class Validator & Class Transformer~~ (reusable on the frontend)
- Jest for testing
- Swagger for API documentation
- TypeORM with PostgreSQL
- Winston for logging (maybe)
- Rate limiting & security middleware (maybe)
- Docker for containerization (donno)

### Plan

#### Project Setup

Initialize **Turborepo** and setup configuration.

#### Backend Develepment

- Integration with RandomUser API [done]
- API documentation with Swagger [done]
- CRUD operations for employees [done]
- Search & filtering
- Pagination
- Entity definitions [done] (in memory)
- Unit test [done]
- Integration tests

#### Common

- Schemas & types (using zod) located in a common package used by both the web and api project [done]

