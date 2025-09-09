---
description: Git commit the changes in the project
auto_execution_mode: 3
---

# Commits
These are guidelines for creating commits on the repo.

**Purpose**: Handle git commits with high-quality, informative commit messages.

1. EVERY TIME THIS COMMAND IS INVOKED - First read the ai/AI_GUIDELINES.md file to control your behaviour.

2. **Analyze Changes**:
   - Review all modified, added, and deleted files
   - Understand the scope and purpose of changes
   - Reference conversation context, ADRs, and documentation updates

3. **Generate Commit Message**:
   - **Format**: Use conventional commit format when applicable
   - **Summary Line**: Clear, concise description (≤50 chars when possible)
   - **Body**: Detailed explanation of what and why (if needed). Be Brief.
   - **Context**: Reference relevant conversation topics, decisions, or framework phases

4. **Commit Standards**:
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

5. **Commit message length**
   - Commit messages length or details should align with the scope and complexity of the change (e.g. the details included in a commit should be small if the change was small or not-complex)
   - Dont include lines about updates to tests or adding new tests unless particularly interesting. 
