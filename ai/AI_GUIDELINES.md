# AI_GUIDELINES

This file is the **authoritative starting point** for any AI session on this repo. 

- It tells you (the AI) what to read, in what order, how to behave, and how to acknowledge the context you loaded. 

When the user says use the AI_GUIDELINES.md for the repo, do the following:

### General Context
- Read and understand AI_GUIDELINES.md (this file)
- Read and understand PROJECT_DETAILS.md
- Read and understand PROJECT_PLAN.md
### Technical Context
- Read and understand tech preference files (tech/*.md)
- Read and understand coding guidelines (in this file)
### Validation
- Output that the AI_GUIDELINES.md loading was complete

## Purpose of AI_GUIDELINES

This is a repeatable, AI-friendly project framework to avoid the common pitfalls of unstructured AI-assisted coding — such as circular progress, regression bugs, and ad-hoc debugging.

This is meant to create a more deliberate, production-grade collaboration between human and AI — balancing speed with structure, preventing drift, and maintaining momentum over the lifetime of the project.

The goals are to:
- Bootstrap quickly and consistently — always start projects with the right scaffolding, testing harnesses, debug tools, and documentation.
-	Enforce test-first, regression-proof workflows — the AI should add/update tests alongside any code changes, using the best-fit libraries for the stack.
-	Optimize the edit–test cycle — keep feedback loops short and efficient.
- Bake in debugability from day one — consistent logging, configurable levels, and pre-wired debugger settings.
-	Work incrementally and interactively — the AI makes small, reviewable changes, and larger architectural decisions are surfaced for human approval.
-	Preserve shared understanding across sessions — use persistent files to store meta-execution rules, tech preferences, product briefs, and the current plan, so the AI can load context and continue without losing alignment.

## Assumptions

- This assumes that we are using an Agent AI code assistant. For example, cascade in Windsurf. The assitant has the ability to run commands, edit files, search, etc. 

## Files

This project uses a dedicated /ai folder as the single source of truth for how AI-assisted development should be performed. All AI-facing instructions, policies, preferences, templates, and project metadata for the repo should live inside /ai. 

- The AI uses these files to control its execution. 
- The AI is expected to reference these files before making decisions or changes.
- For example, reading testing guidelines before writing tests, or consulting templates before generating new artifacts.

- For technology, the specific tech/*preferences take prioritiy over others.

ai/
 - Folder at root of project that contains all the ai collab artifacts

ai/AI_GUIDELINES.md
- Primary entry point for all AI interactions.
- Used at the start of any new conversation to load the project context.

ai/PROJECT_DETAILS.md:
- Per project file
- Filled out by user and by AI collaboratively and as the project evolves
- This is where we keep information about the project as a whole
- Records stack, tools, testing flow, architecture, etc. Place to write detailed technology choices.
- Additionally if we wanted to change how some templates are used to generate (i.e. extra rules) we would locate them here as overrides
- It would have specific flows telling the user (and AI), how to edit the project, run it, test it, connect to debugger, etc.

ai/PROJECT_PRODUCT.md:
- Additional product infomrmation if required

ai/PROJECT_PLAN.md:
- Serves as the primary roadmap for maintaining project direction and context across sessions

ai/tech/
   - Guidelines specific to individual technologies. Usually this is used to populate the PROJECT_DETAILS file

ai/tech/PROJECT_PREFERENCDS.md
    - Layout of project, etc

ai/tech/JAVA_PREFERENCES.md
    - guice or spring boot or maven or subproject or whatever

ai/tech/PYTHON_PREFERENCES.md
    - etc.

ai/templates:
    - These are the templates from which the real file (e.g. README.md) is generated
    - Copied to the correct place in the project as needed.
    - They might not always be present
    - Base templates: README.base.md, CONTRIBUTING.base.md, .editorconfig, ESLint/Prettier bases, CI workflow bases, VS Code launch bases, .gitignore families (node, python, go, etc.), Playwright/Vitest base configs, Logging/Debugging/Testing docs bases, ADR template. Task templates

# Coding guidelines
These are guidelines around how to do coding updates on the repo.

The biggest risks to quality and project momentum come from **large, unfocused changes**. To avoid these, work in **small, reviewable increments** and follow a deliberate plan.

### For New Features or Major Changes
1. **Plan First**  
   - Draft or update the relevant task in `PROJECT_PLAN.md`.  
   - Update architecture notes in `PROJECT_DETAILS.md`.  
   - If the change impacts core structure, create or update an ADR (Architecture Decision Record) under `/ai/ADRS/`.  
2. **Confirm Direction**  
   - Share the updated plan and ADR (if applicable) for approval before writing code.  
   - For significant changes, include alternative options and trade-offs in the ADR.  
3. **Implement Incrementally**  
   - Break work into small, self-contained patches.  
   - Avoid bundling unrelated changes into a single patch.

### General Principles
- DO NOT give up on doing it the correct way and just make stuff up. 
   - Like one time you couldnt get something to work so you decided to just drop the real API integration and to create mocks. That is NOT what I want.
   - Or one time you were supposed to use pnpm but it wasnt installed so you went off the rails.
- The PROJECT_DETAILS.md is the LAW. If something doesnt work or isnt working out then we need to work together to update that FIRST, then change our approach.
- **Iterative**  
  - Work in short cycles with review between steps.  
  - Aim for patches ≤ 150 LoC unless explicitly approved otherwise.
  - Don't go beyond what the requested feature or change that was asked.
- **Test First**  
  - Write or update tests before implementing code.  
  - Ensure coverage for new functionality and regression protection for existing functionality.
- **ADR Usage**  
  - Create an ADR when introducing a new tool, library, architectural pattern, or when making trade-offs that affect maintainability or performance.  
  - Keep ADRs concise, but include enough context to understand the decision in the future.
- **Spec-before-code** (for ongoing tasks)  
  - Propose a small test/spec delta first and get approval before implementing.  
  - Keep spec patches ≤ 50 LoC.
- **Tests + Docs Together**  
  - Any change in behavior must be accompanied by updated tests and, where applicable, documentation in the *same patch*.  
- **No Drive-by Edits**  
  - Do not reformat, restructure, or refactor unrelated code in the same patch as your feature or fix.  
- **When Stuck**  
  - **MANDATORY**: If ANY specified tool, dependency, or command in PROJECT_DETAILS.md is missing or unavailable, STOP immediately
  - **MANDATORY**: Request PROJECT_DETAILS.md update discussion before proceeding with any alternative approach
  - Ask for a decision rather than making assumptions
  - Ask if the user would like for you to create a spike, or a draft ADR
  - **NEVER** substitute tools or dependencies without explicit PROJECT_DETAILS.md update approval
  - **NEVER** give up on doing it the correct way and just make stuff up
  - Examples of FORBIDDEN behavior:
    - Switching from pnpm to npm without PROJECT_DETAILS.md update
    - Dropping real API integration to create mocks without approval
    - Using different libraries than specified without PROJECT_DETAILS.md update

# Initialization Function
These are guidelines around how to do project initialization.

**Purpose**: Collaborative effort to define project, starting architecture, and technology choices.

**Process**:
1. **User Setup**: 
   - User copies the `/ai` folder from this repo into their new project directory
   - User fills out basic information in PROJECT_DETAILS.md (project name, description, primary language, framework preferences)
   - User may leave many fields as placeholders - AI will complete them

2. **AI Initialization**:
   - User tells AI: "Let's initialize the PROJECT_DETAILS for [project-name]"
   - AI follows the Context Validation Checklist from this file
   - AI reads the partially filled PROJECT_DETAILS.md
   - AI scans available tech preference files in `/ai/tech/` to find matches for the chosen technology stack
   - AI references appropriate tech preference files (e.g., TYPESCRIPT_REACT_PREFERENCES.md for TypeScript + React projects)
   - AI completes all remaining fields based on user input, best practices, and tech preferences
   - AI selects appropriate technology stack and documents architectural decisions
   - AI creates new tech preference files if none exist for the chosen stack

3. **Collaborative Refinement**:
   - User reviews AI's technology choices and architectural decisions
   - User can request changes or ask questions about specific choices
   - AI explains rationale and adjusts based on feedback
   - Final PROJECT_DETAILS.md serves as complete specification for bootstrap phase

**Output**: Fully initialized PROJECT_DETAILS.md ready for bootstrap phase, with all technology choices documented and architectural decisions made.

## Bootstrap
**Purpose**: Scaffold complete project structure with all essential configs, dependencies, and development tools based on initialized PROJECT_DETAILS.md.

**Prerequisites**: 
- PROJECT_DETAILS.md must be fully initialized
- Appropriate tech preference files must exist or be created
- User must be in the target project directory

**Bootstrap Process**:

1. **Project Structure Creation**:
   - Create project using appropriate scaffolding tool (Vite, Create React App, etc.)
   - Set up directory structure according to tech preferences
   - Initialize package.json with correct dependencies and scripts

2. **Essential Configuration Files**:
   - Add .gitignore appropriate for the tech stack
   - Configure language-specific settings (refer to tech preferences)
   - Set up linting and formatting tools (refer to tech preferences)
   - Add editor settings and extensions recommendations (.vscode/ or similar)
   - Configure testing framework (refer to tech preferences for specific setup)

3. **Development Environment Setup**:
   - Install all dependencies using preferred package manager (refer to tech preferences)
   - Set up git hooks if specified (pre-commit, pre-push, etc.)
   - Configure build and development scripts (refer to tech preferences)
   - Set up debugging configurations (refer to tech preferences)

4. **Documentation and Templates**:
   - Generate README.md from template with project-specific content
   - Create CONTRIBUTING.md if applicable
   - Set up basic project documentation structure
   - Add code templates and snippets

5. **Initial Code Structure**:
   - ONLY create the bare amount required to see that the service is running and that the core libraries work.
   - THIS is the most essential start.

6. **Validation and Testing**:
   - Run initial build to verify setup
   - Execute test suite to ensure framework works
   - Verify linting and formatting tools
   - Test development server startup

7. Generate a PROJECT_PLAN.md (updating existing):
   - This should have the next steps for actually building the project.

**Output**: Fully functional project ready for development with all tools configured and working.

# Commits
These are guidelines for creating commits on the repo.

**Purpose**: Handle git commits with high-quality, informative commit messages.

**Process**:
When the user says "commit" or "commit the changes":
(Dont do this on your own. always ask first)

1. **Analyze Changes**:
   - Review all modified, added, and deleted files
   - Understand the scope and purpose of changes
   - Reference conversation context, ADRs, and documentation updates

2. **Generate Commit Message**:
   - **Format**: Use conventional commit format when applicable
   - **Summary Line**: Clear, concise description (≤50 chars when possible)
   - **Body**: Detailed explanation of what and why (if needed). Be Brief.
   - **Context**: Reference relevant conversation topics, decisions, or framework phases

3. **Commit Standards**:
   - Use present tense ("Add feature" not "Added feature")
   - Be specific about what changed
   - Include rationale for significant changes
   - Reference framework phases (Initialization, Bootstrap, Development)
   - Mention any ADRs or policy updates

**Example Commit Messages**:
```
feat: Add TypeScript React preferences for AI_DEV framework

- Create TYPESCRIPT_REACT_PREFERENCES.md with comprehensive tech stack guidance
- Include project structure, component patterns, and deployment preferences  
```

```
docs: Document initialization process in AI_GUIDELINES.md

- Add detailed 3-step initialization workflow (User Setup → AI Init → Refinement)
- Include explicit tech preferences scanning step

Based on successful ai-dev-demo-project-ts initialization experience.
```

**AI Behavior**: 
- Always stage all relevant changes before committing
- Provide clear summary of what will be committed
- Ask for confirmation only if commit scope is unusually large or sensitive

