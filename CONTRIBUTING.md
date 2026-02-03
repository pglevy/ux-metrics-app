# Contributing to Schema-First Prototyping

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Ways to Contribute

### 🐛 Reporting Bugs

Before creating a bug report:
1. Check existing [Issues](../../issues) to avoid duplicates
2. Gather information about your environment (OS, Node version, etc.)

When creating a bug report, include:
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or code snippets if applicable
- Your environment details

### 💡 Suggesting Features

Feature requests are welcome! Please:
1. Check [Discussions](../../discussions) for similar ideas
2. Describe the problem you're trying to solve
3. Explain your proposed solution
4. Consider how it fits with the project's goals

### 📝 Improving Documentation

Documentation improvements are always appreciated:
- Fix typos or unclear explanations
- Add examples or clarifications
- Create guides for specific use cases
- Improve code comments

### 🎨 Contributing Examples

Have a great Schema-First example? Share it!

**Requirements:**
- Complete OpenAPI schema in `schema/api-contract.yaml`
- Domain and behavior models in `concept-model/`
- Working React UI that builds successfully
- README explaining what the example demonstrates
- Clear, well-commented code

**Structure:**
```
examples/your-example/
├── schema/
│   ├── api-contract.yaml
│   └── evolution-log.md
├── concept-model/
│   ├── domain-model.md
│   └── behavior-model.md
├── api/
│   ├── types/
│   └── mock-server/
├── ui/
│   └── src/
└── README.md
```

### 💻 Contributing Code

#### Getting Started

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR-USERNAME/schema-first-prototyping.git
   cd schema-first-prototyping
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Write clear, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation as needed

4. **Test your changes**
   ```bash
   # Test the template UI
   cd ui
   npm install
   npm run build  # Must pass without errors
   npm run dev    # Verify it works
   
   # Test the example
   cd ../examples/ticketing-system/ui
   npm install
   npm run build  # Must pass without errors
   npm run dev    # Verify it works
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```
   
   **Commit message format:**
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for improvements to existing features
   - `Docs:` for documentation changes
   - `Refactor:` for code refactoring

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub.

#### Code Style Guidelines

**TypeScript/React:**
- Use TypeScript for all new code
- Prefer functional components with hooks
- Use meaningful variable and function names
- Keep components focused and single-purpose
- Add JSDoc comments for complex functions

**OpenAPI Schema:**
- Follow OpenAPI 3.1 specification
- Include descriptions for all schemas and properties
- Use consistent naming conventions
- Add examples where helpful

**Documentation:**
- Use clear, concise language
- Include code examples
- Keep formatting consistent
- Test all commands and code snippets

#### Pull Request Guidelines

Your PR should:
- Have a clear title describing the change
- Reference any related issues (`Fixes #123`)
- Include a description of what changed and why
- Pass all builds (TypeScript compilation)
- Update relevant documentation
- Add examples if introducing new features

**PR Description Template:**
```markdown
## What does this PR do?
Brief description of the changes

## Why is this needed?
Explain the problem this solves

## How was this tested?
Describe how you verified the changes work

## Related Issues
Fixes #123
```

### 🔧 Contributing Skills

Want to add new AI skills for contract maintenance?

**Requirements:**
- Clear purpose and trigger conditions
- Well-documented behavior
- Examples of input/output
- Integration with existing skills

See [docs/writing-skills.md](./docs/writing-skills.md) for guidance.

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)

### Local Development

1. **Clone and install**
   ```bash
   git clone https://github.com/YOUR-USERNAME/schema-first-prototyping.git
   cd schema-first-prototyping
   cd ui && npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Make changes and test**
   - Edit files in `ui/src/`
   - Changes hot-reload automatically
   - Check browser console for errors

4. **Build before committing**
   ```bash
   npm run build
   ```
   Fix any TypeScript errors before pushing.

## Project Structure

```
schema-first-prototyping/
├── .claude/skills/          # AI contract-maintenance skills
├── schema/                  # Template API contract
├── concept-model/           # Template documentation
├── api/                     # Generated artifacts
├── ui/                      # Template React UI
├── examples/                # Working examples
├── docs/                    # Documentation
├── AGENTS.md               # Agent reference
├── README.md               # Main documentation
└── CONTRIBUTING.md         # This file
```

## Questions?

- 💬 **General questions**: Use [GitHub Discussions](../../discussions)
- 🐛 **Bug reports**: Open an [Issue](../../issues)
- 📧 **Private inquiries**: Contact maintainers directly

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Violations may result in:
1. Warning from maintainers
2. Temporary ban from the project
3. Permanent ban for serious or repeated violations

Report issues to project maintainers.

## Recognition

Contributors will be:
- Listed in release notes
- Credited in the README (for significant contributions)
- Thanked in commit messages

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Schema-First Prototyping!** 🎉
