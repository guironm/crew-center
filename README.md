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
- I am thinking of using React for the front end, win-win since I have been enjoying it and the requirements say that's the best option for this assignment.
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

### Architecture

#### Codebase / repo strategy

The solution follows a monorepo strategy using **Turborepo** with mainly _apps_ an _packages_ folder structure.

##### Apps

📦 API [Nestjs]

📦 Web [Nextjs]

##### Packages

📦 typescript-config

📦 eslint-config

📦 schemas

This monorepo architecture enables seamless code sharing between frontend and backend, particularly for:

1. **Shared Type Definitions**: TypeScript interfaces and types can be defined once in the schemas package and used across applications, ensuring type safety and consistency.

2. **Validation Logic**: Zod schemas can be defined in a shared package and reused, preventing duplication and ensuring the same validation rules apply everywhere.

3. **Configuration Consistency**: Shared ESLint and TypeScript configs maintain consistent code quality standards across the codebase.

4. **Developer Experience (DX)**: Single repository checkout, unified dependency management, and coordinated builds significantly improve workflow efficiency.

5. **Atomic Changes**: Updates that span both frontend and backend can be made, tested, and committed together, reducing integration issues.

This approach is particularly valuable in both solo development (reducing context switching) and team environments (facilitating collaboration between frontend and backend developers).

#### System / Deployment strategy

The System architecture supports flexible deployment options:

1. **Separate Deployments**:

   - **API**: Can be deployed independently to services like AWS ECS, Google Cloud Run, or Azure App Service
   - **Web**: Can be deployed to Vercel, Netlify, or similar static hosting/JAMstack platforms
   - This approach allows for independent scaling and resource allocation based on specific needs

2. **Single Deployable Unit**:

   - Both applications can be containerized together using Docker Compose
   - Enables simpler deployment to container orchestration platforms like Kubernetes
   - Simplifies local development and testing of the complete system

3. **Hybrid Approach**:

   - Development and testing in a unified environment
   - Production deployment with separate scaling and management for frontend and backend

   CI/CD complexity shouln't be that bad in all cases.

The architecture maintains clean separation of concerns while providing deployment flexibility based on operational requirements, team structure, and infrastructure constraints.

#### Application / Logic architecture

The application follows a layered architecture pattern, particularly in the NestJS backend:

#### NestJS Layered Architecture

1. **Controllers Layer**:

   - Handles HTTP requests and delegates business operations to services
   - Defines routes, validates input, and returns appropriate responses
   - Focuses solely on request/response handling, not business logic

2. **Services Layer**:

   - Contains business logic and domain-specific operations
   - Orchestrates data access and transformation

3. **Repositories Layer**:

   - Abstracts data access operations
   - Handles database interactions through TypeORM
   - Provides a clean interface for services to work with data

   for the current implementation I am coupling the solution to TypeORM, however it is possible to fully implement the **repository pattern** to abstract away even that, this way allowing ORM swapping with minimal changes.

   in the future if we would require rollback functionality we can use the **unit of work** pattern as well in conjunction with repository. For now, I think it is overkill.

#### React layered architecture?

whatever pattern or architecture you do in react there will be a hoard of critics explaining why their way is better, howwever I went with **colocation** with some conventions for folder structures encouraged in next js projects. However there is a general API client folder. This structure can change when the project grows.

I need to read up and experiment more with server actions, ssr and all of the nextjs features. So I focused on the client side for this project.

### Teck Stack

#### Frontend

- React ~~18 with Vite~~ nextjs (comes with turborepo)
- TypeScript
- TailwindCSS for styling
- React Query for server state management [done]
- nextjs app router..🤷 ~~React Router v6 for routing~~
- Zod for schema validation
- testing ?
- Framer Motion for animations (maybe)
- React Hook Form for form handling [done]

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
- Search & filtering [done]
- Pagination
- Entity definitions [done] (in memory)
- Unit test [done]
- Integration tests
- TypeOrm

#### Frontend Development

- CRUD integration with backend using React Query and regular fetch [done]
- Forms [react hook form] for creating and updating employees (just a button for delete) [done]
- avoid using context or state management since React Query was enough [done]
- implement nextjs router [done]
- Search & filtering [done]
- Pagination

#### Common

- Schemas & types (using zod) located in a common package used by both the web and api project [done]

### Design choices

#### API

- **Users**: was not sure if this will be used, for now exposed an endpoint to get random users.
  the users service can work with different random users providers
- **Employees**:
  handles employee crud operations

**schema**
shared zod schema and infered types

**validation pipe**
validates incoming DTOs

**custom exception filter**
handles zod validation exceptions

The service layer accepts DTOs since we do not have rich domain objects that would warrant such a conversion between the application layers.
