---
description: Git commit the changes in the project
auto_execution_mode: 3
---

# Commits
These are guidelines for creating commits on the repo.

**Purpose**: Handle git commits with high-quality, informative commit messages.

1. **MANDATORY FIRST STEP**: ALWAYS read ai/AI_GUIDELINES.md file first before any other action
   - Use Read tool on /Users/demo/dev/personal/subnautica/subnautica-map/ai/AI_GUIDELINES.md
   - Acknowledge that guidelines have been loaded with ✅ checkmark
   - This step CANNOT be skipped or automated - must be done manually every time

2. **MANDATORY SECOND STEP**: ALWAYS read ai/PROJECT_DETAILS.md file
   - Use Read tool on /Users/demo/dev/personal/subnautica/subnautica-map/ai/PROJECT_DETAILS.md
   - Acknowledge that Project Details have been loaded with ✅ checkmark
   - This step CANNOT be skipped or automated - must be done manually every time

3. **MANDATORY SECOND STEP**: ALWAYS read ai/PROJECT_PLAN.md file
   - Use Read tool on /Users/demo/dev/personal/subnautica/subnautica-map/ai/PROJECT_PLAN.md
   - Acknowledge that Project Plan has been loaded with ✅ checkmark
   - This step CANNOT be skipped or automated - must be done manually every time

4. **Analyze Changes**:
   - Review all modified, added, and deleted files
   - Understand the scope and purpose of changes
   - Reference conversation context, ADRs, and documentation updates

5. **Generate Commit Message**:
   - **Format**: Use conventional commit format when applicable
   - **Summary Line**: Clear, concise description (≤50 chars when possible)
   - **Body**: Detailed explanation of what and why (if needed). Be Brief.
   - **Context**: Reference relevant conversation topics, decisions, or framework phases

6. **Commit Standards**:
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

7. **Commit message length**
   - Commit messages length or details should align with the scope and complexity of the change (e.g. the details included in a commit should be small if the change was small or not-complex)
   - Dont include lines about updates to tests or adding new tests unless particularly interesting.